import { ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { RemoveFile } from "../utils/RemoveFile";
import ENV from "../../singleton/env";
import APP_DATA from "../../singleton/appData.singleton";
import FILTERS from "../../singleton/filters.singleton";
import { execFile } from "child_process";
import { Json2Xml } from "../utils/Json2Xml";
import { WriteXmlFile } from "../utils/WriteXmlFile";

  
ipcMain.on('resultGenerator', async (event, value) => {

    const {id, count, data, chart_type, goodDirection = 0, isActive, influence} = value
    
    await RemoveFile(path.join(path.join(ENV.FEATURE_ANALYZER_PATH, "Progress.txt")))
    await RemoveFile(path.join(path.join(ENV.FEATURE_ANALYZER_PATH, "userData.json")))
    await RemoveFile(path.join(path.join(ENV.FEATURE_ANALYZER_PATH, "results.json")))
    const filterIndex = FILTERS.getAll().findIndex(ele => ele.id === id)
    
    const p1 = {x: 0, y: 0}
    const p2 = {x: 255, y: 0}

    
    if (data && Object.keys(data).length) {
        if (typeof data?.verticalLines === "object") {
            p1.x = data?.verticalLines[0] ?? 0
            p2.x = data?.verticalLines[1] ?? 255
        }
        if (String(data?.horizontalLine)) {
            p1.y = data?.horizontalLine ?? 0
            p2.y = data?.horizontalLine ?? 0
        }
        if (typeof data?.extendedLines === "object" && data?.extendedLines.length) {
            p1.y = data?.extendedLines[0].y ?? 0
            p2.y = data?.extendedLines[1].y ?? 0
        }
    }

    const chartData = [
        {
            p1,
            p2,
            isTopSelected: goodDirection ? false : true,
            // isGoodSelected: APP_DATA.getAppData().defaultObjectType ? 1 : 0,
            isActive,
            influence,
            // priority: filterIndex
        }
    ]

    let json = {
        // count : process.env.ELECTRON_APP_OBJ_HANDLING_COUNT ?? 1000,
        count : count == "-1" ? 2000 : +count,
        defaultObjectType: APP_DATA.getAppData().defaultObjectType ? 1 : 0,
        [chart_type?.toLowerCase()]: chartData
    }
    
    fs.writeFileSync(path.join(ENV.FEATURE_ANALYZER_PATH, "userData.json"), JSON.stringify(json, null, 4))



    
    await RemoveFile(path.join(ENV.FEATURE_ANALYZER_PATH, 'config.xml'))
    const appData = APP_DATA.getAppData()
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

    FILTERS.update(id, {userData: json, data, goodDirection: goodDirection, filterValues: {count, isActive, influence} })
    execFile(`ResultGenerator.exe`, [], { cwd: ENV.FEATURE_ANALYZER_PATH }, (error, stdout, stderr) => {
        if (error) {
            return event.sender.send('resultGenerator_chanel', {error: error});
        }
        if(stdout) {
            return event.sender.send('resultGenerator_chanel', {data: stdout});
        }
        if (stderr) {
            return event.sender.send('resultGenerator_chanel', {error: stderr});
        }
    });

});
  


ipcMain.on("resultGeneratorProgress", (event) => {
    const progressPath = path.join(ENV.FEATURE_ANALYZER_PATH, "Progress.txt")
    if(fs.existsSync(progressPath)) {
        fs.readFile(progressPath, 'utf8', (err, data) => {
            return event.sender.send("resultGeneratorProgress_chanel", {progress: Number(data)})
        })
    } else {
        return event.sender.send("resultGeneratorProgress_chanel", {progress: 0,})
    }
})

export default ipcMain

  
// const readRes = (event, filterName) => {
//     if(fs.existsSync(`${resultsDir}${filterName}Results.json`)) {
//       fs.readFile(`${resultsDir}${filterName}Results.json`, 'utf8', (err, data) => {
//         // if (err) {
//         //   Loggers.error(err);
//         //   event.sender.send('resultsData', { err: err });
//         //   return;
//         // }
//         const resultsData = JSON.parse(data);
//         // isLoadingChartData = false;
//         event.sender.send('resultsData', resultsData);
//       });
//     } else {
//     //   Loggers.error(`${resultsDir}${filterName}Results.json not exists`);
//       event.sender.send('resultsData', {});
//     }
// }