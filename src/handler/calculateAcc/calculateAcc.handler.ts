import { ipcMain } from "electron"
import path from "path"
import fs from "fs"
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
const { json2xml, js2xml, xml2js } = require('xml-js');

const toXmlOption =  { 
    compact: true,
    ignoreComment: true,
    ignoreDeclaration: false,
    spaces: 4
}

ipcMain.on("calculateAcc", async (event, data) => {
    // readIdealPointController(event, data)
    // function readIdealPointController(event, data) {
    
        const {verticalLinesValueIntensity, verticalLinesValue, id, filtersArea, filtersIntensity, pointSelectedData, chartValueSelected, intensityChartValueSelected} = data;
        const {influenceTop, influenceDown} = FILTERS.getById(id)
      
        if (
          !APP_DATA.getAppData().healthy ||
          !APP_DATA.getAppData().not_healthy ||
          !verticalLinesValueIntensity ||
          !verticalLinesValue
        ) return event.sender.send("calculateAcc_chanel", {status:  false, message: "ابتدا فهرست را کامل کنید"})
      
        // const newConfig = {
        //   ...APP_DATA.getAppData(),
        //   delta: verticalLinesValueIntensity / Math.pow(10, DECIMAL.get()),
        //   area: verticalLinesValue,
        // }
      
        // APP_DATA.set(newConfig);
        const delta = verticalLinesValueIntensity / Math.pow(10, DECIMAL.get());
        const area = verticalLinesValue / 100 ;
      
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
      
        await RemoveFile(path.join(ENV.FEATURE_ANALYZER_PATH, "Hesaab\\confusions"))
        await RemoveFile(path.join(ENV.FEATURE_ANALYZER_PATH, "Hesaab\\parameters.xml"))
        await RemoveFile(path.join(ENV.FEATURE_ANALYZER_PATH, "Hesaab\\folders.xml"))
        const parametersJson = js2xml(parameters, toXmlOption)
        await WriteXmlFile(parametersJson, path.join(ENV.FEATURE_ANALYZER_PATH, "Hesaab\\parameters.xml"))
        execFile("./CalculateAcc.exe", [], { cwd: path.join(ENV.FEATURE_ANALYZER_PATH, "Hesaab")}, (error: any, stdout: any, stderr: any) => {
            if (error) return event.sender.send('calculateAcc_chanel', {status: false, message: error});
            if (stderr) return event.sender.send('calculateAcc_chanel', {status: false, message: stderr});
            if(stdout) {
                if (stderr.includes("error:")) return event.sender.send('calculateAcc_chanel', {status: false, message: stderr}) 
                const filesPath = readfilePath()
                const idealConfusion = readIdealConfusionTest(delta)
                FILTERS.update(id, {delta, area, filesPath, idealConfusion, filtersArea, filtersIntensity, pointSelectedData, chartValueSelected, intensityChartValueSelected})
                const data = {
                status: true, 
                data: {
                    ...APP_DATA.getAppData(), 
                    stdout,
                    filters: FILTERS.getAll()
                }, 
                message: "created"
                }
                return event.sender.send('calculateAcc_chanel', data);
            } 
        });
    
    const readfilePath = () => {
        const filePath = `${ENV.FEATURE_ANALYZER_PATH}\\Hesaab\\folders.xml`;
        try {
          const readFilesPathXML = fs.readFileSync(filePath, "utf8");
          const parser = new XMLParser({
            ignoreAttributes: false,
          });
          const parsXML = parser.parse(readFilesPathXML)
          const healthy = {};
          const nonHealthy = {};
          Object.entries(parsXML.opencv_storage).forEach(([key, value]: any) => {
            const imagesName: any = []
            Object.entries(value).map(([fileKey, fileValue]: any) => fileKey.includes("im") && imagesName.push(fileValue.split("/").pop()))
            const readDir = fs.readdirSync(value.folder);
            const fileHealthy: any = key.includes("Non") ? nonHealthy : healthy
            fileHealthy[value.folder] = {isInXml: [], isOutXml: []}
            if (readDir.length) {
              readDir.forEach(fileName => {
                if (fileName.includes("_image.bmp")) {
                  const filePath = path.join(value.folder, fileName);
                  const readImage = readImageUtil(filePath)
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

