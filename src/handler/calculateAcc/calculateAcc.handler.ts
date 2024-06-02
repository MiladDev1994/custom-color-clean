import { ipcMain } from "electron"
import path from "path"
import fs from "fs"
import colors from "colors"
import fspromises from "fs/promises"
import APP_DATA from "../../singleton/appData.singleton"
import { DECIMAL } from "../../singleton/confusion.singleton"
import ENV from "../../singleton/env"
import { execFile } from "child_process"
import { XMLParser } from "fast-xml-parser"
import { readImageUtil } from "../utils/readImageUtil"
import { scanIdealPoint } from "../utils/ScanIdealPoints"
import { RemoveFile } from "../utils/RemoveFile"
import { WriteXmlFile } from "../utils/WriteXmlFile"
import FILTERS from "../../singleton/filters.singleton"
import { chartTheme } from "../../view/Components/IntensityChart/Theme"
import { json2xml, js2xml, xml2js } from "xml-js"

const toXmlOption =  { 
    compact: true,
    // ignoreComment: true,
    ignoreDeclaration: false,
    spaces: 4
}

ipcMain.on("calculateAcc", async (event, data) => {
    // readIdealPointController(event, data)
    // function readIdealPointController(event, data) {
    
        const {id, verticalLinesValueIntensity, verticalLinesValueArea, intensityPointSelectedData, areaPointSelectedData, areaGraphs, intensityGraphs} = data;
        const {influenceTop, influenceDown, allIdealPoints: oldIdealPoint = [], Mean2DH_V} = FILTERS.getById(id)
      
        await RemoveFile(path.join(ENV.FEATURE_ANALYZER_PATH, "Hesaab", "confusions"))
        await RemoveFile(path.join(ENV.FEATURE_ANALYZER_PATH, "Hesaab", "parameters.xml"))
        await RemoveFile(path.join(ENV.FEATURE_ANALYZER_PATH, "Hesaab", "folders.xml"))
        await RemoveFile(path.join(ENV.FEATURE_ANALYZER_PATH, "Hesaab", "Mean2DH_V.xml"))

        if (
          !APP_DATA.getAppData().healthy ||
          !APP_DATA.getAppData().not_healthy ||
          !verticalLinesValueIntensity ||
          !verticalLinesValueArea
        ) return event.sender.send("calculateAcc_chanel", {status:  false, message: "ابتدا فهرست را کامل کنید"})
      
        if (!Mean2DH_V) return event.sender.send("calculateAcc_chanel", {status:  false, message: "فایل Mean2DH_V.xml یافت نشد"})
          const Mean2DStructureXml = js2xml(Mean2DH_V ?? {} as any, toXmlOption);
          await WriteXmlFile(Mean2DStructureXml, path.join("C:\\scpc\\featureAnalyzer\\Hesaab", "Mean2DH_V.xml"))
        // const newConfig = {
        //   ...APP_DATA.getAppData(),
        //   delta: verticalLinesValueIntensity / Math.pow(10, DECIMAL.get()),
        //   area: verticalLinesValue,
        // }
      
        // APP_DATA.set(newConfig);
        const delta = verticalLinesValueIntensity / Math.pow(10, DECIMAL.get());
        const area = verticalLinesValueArea / 100 ;
      
        let parameters = {
          "_instruction": { "xml": { "_attributes": { "version": "1.0" } } },
          "opencv_storage": {
            "healthy": `"${APP_DATA.getAppData().healthy.replace(/\\/g, "/")}"`,
            "nonhealthy": `"${APP_DATA.getAppData().not_healthy.replace(/\\/g, "/")}"`,
            "influenceT": influenceTop,
            "influenceD" : influenceDown,
            delta,
            area
          }
        };
      
        const parametersJson = js2xml(parameters as any, toXmlOption)
        await WriteXmlFile(parametersJson, path.join(ENV.FEATURE_ANALYZER_PATH, "Hesaab\\parameters.xml"))
        execFile("./CalculateAcc.exe", [], { cwd: path.join(ENV.FEATURE_ANALYZER_PATH, "Hesaab")}, (error: any, stdout: any, stderr: any) => {
            if (error) return event.sender.send('calculateAcc_chanel', {status: false, message: error});
            if (stderr) return event.sender.send('calculateAcc_chanel', {status: false, message: stderr});
            if(stdout) {
                if (stderr.includes("error:")) return event.sender.send('calculateAcc_chanel', {status: false, message: stderr}) 
                const filesPath = readImagesPath()
                const idealConfusion: any = readIdealConfusionTest(delta)
                const allIdealPoints = [...oldIdealPoint]
                const newIdealPoint = {
                  X: intensityPointSelectedData?.position?.verticalLines[0],
                  Y: Math.round(idealConfusion.record.e8 * 100),
                  filesPath,
                  idealConfusion,
                  intensityPointSelectedData,
                  areaPointSelectedData,
                  areaGraphs,
                }
                allIdealPoints.push(newIdealPoint)

                const newIntensityGraphs = [...intensityGraphs]
                const newGraph = {
                  ...chartTheme.public, 
                  ...chartTheme["e8_ideal"],
                  data: idealConfusion.pointData["e8"],
                }

                newIntensityGraphs.unshift(newGraph)
                FILTERS.update(id, {allIdealPoints, delta, area, intensityGraphs: newIntensityGraphs})
                APP_DATA.setIsChanged()
                const data = {
                status: true, 
                data: {
                    ...APP_DATA.getAppData(), 
                    stdout,
                    filters: FILTERS.getAll(),
                    idealPoint: newIdealPoint,
                    graph: newGraph,
                    appData: APP_DATA.getAppData()
                }, 
                message: "created"
                }
                return event.sender.send('calculateAcc_chanel', data);
            } 
        });
    
    const readImagesPath = () => {
        const filePath = `${ENV.FEATURE_ANALYZER_PATH}\\Hesaab\\folders.xml`;
        try {
          const readFilesPathXML = fs.readFileSync(filePath, "utf8");
          const parser = new XMLParser({
            ignoreAttributes: false,
          });
          const parsXML = parser.parse(readFilesPathXML)
          // console.log(parsXML, "parsXML")
          const healthy = {};
          const nonHealthy = {};
          Object.entries(parsXML.opencv_storage).forEach(([key, value]: any) => {
            const imagesName: any = []
            Object.entries(value).map(([fileKey, fileValue]: any) => fileKey.includes("im") && imagesName.push(fileValue.replaceAll('"', '').split("/").pop()))
            const readDir = fs.readdirSync(value.folder.replaceAll('"', ''));
            // console.log(readDir, "readDir")
            const fileHealthy: any = key.includes("Non") ? nonHealthy : healthy
            fileHealthy[value.folder] = {isInXml: [], isOutXml: []}
            if (readDir.length) {
              readDir.forEach(fileName => {
                if (fileName.includes("_image.bmp")) {
                  const filePath = path.join(value.folder.replaceAll('"', ''), fileName);
                  const readImage = readImageUtil(filePath)
                  // console.log(readImage, "readDir")
                  if (imagesName.includes(fileName)) {
                    fileHealthy[value.folder]["isInXml"].push(readImage)
                  } else {
                    fileHealthy[value.folder]["isOutXml"].push(readImage)
                  }
                }
              })
            }
          })
          return {healthy, nonHealthy};
        } catch (_) {
          return {healthy: {}, nonHealthy: {}};
        }
      }
      
    const readIdealConfusionTest = (delta: any) => {
      const scanFolders = scanIdealPoint(delta);
      return scanFolders.status ? scanFolders.data : {}
    }

    
})


export default ipcMain

