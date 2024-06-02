import { ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { RemoveFile } from "../../utils/RemoveFile";
import ENV from "../../../singleton/env";
import APP_DATA from "../../../singleton/appData.singleton";
import FILTERS from "../../../singleton/filters.singleton";
import { execFile } from "child_process";
import { getSampleImages } from "../../randomImage/randomImage.service";
import { Json2Xml } from "../../utils/Json2Xml";
import { WriteXmlFile } from "../../utils/WriteXmlFile";

  
ipcMain.on('resultGenerator_conclusion', async (event, values) => {

    const appData = APP_DATA.getAppData()
    const filters = FILTERS.getAll().filter((item: any) => item.filter_type === "LINE")
    await RemoveFile(path.join(path.join(ENV.FEATURE_ANALYZER_PATH, "Progress.txt")))
    await RemoveFile(path.join(path.join(ENV.FEATURE_ANALYZER_PATH, "userData.json")))
    await RemoveFile(path.join(path.join(ENV.FEATURE_ANALYZER_PATH, "results.json")))
    const count = values?.count ?? 20

    let json: any = {}
    let configJson: any = {};
    filters.forEach(ele => {
        if (!(ele.userData && Object.keys(ele.userData).length)) return
        delete ele?.userData?.count;
        delete ele?.userData?.defaultObjectType;
        const chartType: any = Object.keys(ele.userData)

        const chartData = {...ele.userData?.[chartType]?.[0], isActive: values?.[`effect_${ele.id}`] ?? true}
        const chartDataForJsonVar = {...chartData, id: ele.id}
        if (!Object.keys(json)?.includes(chartType.join(""))) {
            json[chartType] = [chartDataForJsonVar]
            configJson[chartType] = [chartData]
        } else {
            json[chartType].push(chartData)
            configJson[chartType].push(chartDataForJsonVar)
        }
    })
    json.count = count
    json.defaultObjectType = appData.app_type ? 1 : 0
    configJson.count = count
    configJson.defaultObjectType = appData.app_type ? 1 : 0

    
    fs.writeFileSync(path.join(ENV.FEATURE_ANALYZER_PATH, "userData.json"), JSON.stringify(configJson, null, 4))


    
    
    await RemoveFile(path.join(ENV.FEATURE_ANALYZER_PATH, 'config.xml'))
    let isBackgroundBlue = false;
    switch (appData.product_type.toUpperCase()) {
    case "MUNG":
    case "SUNFLOWERSEED":
        isBackgroundBlue = true;
        break;
    }
    let config = {
        "_instruction": { "xml": { "_attributes": { "version": "1.0" } } },
        "opencv_storage": {
          "healthy": `"${appData?.healthy.replace(/\\/g, "/")}"`,
          "nonhealthy": `"${appData?.not_healthy.replace(/\\/g, "/")}"`,
          "ObjectType": appData?.product_type.toLowerCase(),
          "IsBackgroundBlue" : isBackgroundBlue,
          "AddHoleHistogram": true,
          "removeBlueBack": appData?.removeBlueBack
        }
    };
    const objToXml = await Json2Xml(config)
    await WriteXmlFile(objToXml, path.join(ENV.FEATURE_ANALYZER_PATH, "config.xml"))


    execFile(`ResultGenerator.exe`, [], { cwd: ENV.FEATURE_ANALYZER_PATH }, async (error, stdout, stderr) => {
        if (error) {
            return event.sender.send('resultGenerator_conclusion_chanel', {status: false, error: error});
        }
        if(stdout) {
            const resultPath = path.join(ENV.FEATURE_ANALYZER_PATH, "results.json")
            try {
                const result = fs.readFileSync(resultPath, "utf8")
                const parseResult = JSON.parse(result)
                const chartType = "total"
                const images = await getSampleImages(["healthy", "nonHealthy"], parseResult, count, chartType)
                const filters = [...FILTERS.getAll()]
                const existConclusion = filters.filter((item: any) => item.filter_type !== "Conclusion")
                const newFilter = {
                    filter_type: "Conclusion",
                    images,
                    result: parseResult,
                    userData: json,
                    filterValues: {count}
                }
                FILTERS.set(existConclusion)
                FILTERS.push(newFilter)
                return event.sender.send('resultGenerator_conclusion_chanel', {status: true, filters: FILTERS.getAll()});
            } catch(error) {
                return event.sender.send('resultGenerator_conclusion_chanel', {status: false, error: error});
            }
        }
        if (stderr) {
            return event.sender.send('resultGenerator_conclusion_chanel', {status: false, error: stderr});
        }
    });

});
  


// ipcMain.on("resultGeneratorProgress", (event) => {
//     const progressPath = path.join(ENV.FEATURE_ANALYZER_PATH, "Progress.txt")
//     if(fs.existsSync(progressPath)) {
//         fs.readFile(progressPath, 'utf8', (err, data) => {
//             return event.sender.send("resultGeneratorProgress_chanel", {progress: Number(data)})
//         })
//     } else {
//         return event.sender.send("resultGeneratorProgress_chanel", {progress: 0,})
//     }
// })

export default ipcMain
