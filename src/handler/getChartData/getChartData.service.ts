
import path from "path";
import { WriteXmlFile } from "../utils/WriteXmlFile";
import { RemoveFile } from "../utils/RemoveFile";
import PROGRAM_DATA from "../../singleton/programData.singleton";
import { Json2Xml } from "../utils/Json2Xml";
import ENV from "../../singleton/env";
const { execFile } = require('child_process');
const featurePath = ENV.FEATURE_ANALYZER_PATH


export async function ONE(event: any, value: any) {
    const { healthy, not_healthy, product_type, removeBlueBack } = value

    let isBackgroundBlue = false;
    switch (product_type.toUpperCase()) {
      case "MUNG":
      case "SUNFLOWERSEED":
        isBackgroundBlue = true;
        break;
    }

    let config = {
      "_instruction": { "xml": { "_attributes": { "version": "1.0" } } },
      "opencv_storage": {
        "healthy": `"${healthy.replace(/\\/g, "/")}"`,
        "nonhealthy": `"${not_healthy.replace(/\\/g, "/")}"`,
        "ObjectType": product_type.toLowerCase(),
        "IsBackgroundBlue" : isBackgroundBlue,
        "AddHoleHistogram": true,
        "removeBlueBack": removeBlueBack
      }
    };

    await RemoveFile(path.join(featurePath, 'config.xml'))
    await RemoveFile(path.join(featurePath, 'Progress.txt'))
    await RemoveFile(path.join(featurePath, 'hists.json'))
    const objToXml = await Json2Xml(config)
    await WriteXmlFile(objToXml, path.join(featurePath, "config.xml"))
    
    execFile(`HistogramGenerator.exe`, { cwd: featurePath }, (error: any, stdout: any, stderr: any) => {
      if (error) {
        return event.sender.send("getChartData_chanel", {status: false, message: error.message})
      }
      if(stdout) {
        PROGRAM_DATA.set(value)
        return event.sender.send("getChartData_chanel", {status: true, data: stdout})
      }
      if (stderr) {
          return event.sender.send("getChartData_chanel", {status: false, message: error?.message})
      }
    });

}


export async function TWO(event: any, value: any) {
  const {healthy, not_healthy, influenceTop, influenceDown} = value

  let config = {
    "_instruction": { "xml": { "_attributes": { "version": "1.0" } } },
    "opencv_storage": {
      "healthy": `"${healthy.replace(/\\/g, "/")}"`,
      "nonhealthy": `"${not_healthy.replace(/\\/g, "/")}"`,
      "influenceTop": Number(influenceTop),
      "influenceDown" : Number(influenceDown),
    }
  };

  console.log(config)
  await RemoveFile(path.join(path.join(featurePath, "BehIabi", "config.xml")))
  await RemoveFile(path.join(path.join(featurePath, "BehIabi", "confusions")))
  await RemoveFile(path.join(path.join(featurePath, "BehIabi", "Progress.txt")))
  const objToXml = await Json2Xml(config)
  await WriteXmlFile(objToXml, path.join(featurePath, "BehIabi", "config.xml"))
  
  PROGRAM_DATA.set(value)

  execFile(`HistogramSearch.exe`, { cwd: path.join(featurePath, "BehIabi") }, (error: any, stdout: any, stderr: any) => {
    if (error) {
      return event.sender.send("getChartData_chanel", {status: false, message: error.message})
    }
    if(stdout) {
      return event.sender.send("getChartData_chanel", {status: true, data: stdout})
    }
    if (stderr) {
        return event.sender.send("getChartData_chanel", {status: false, message: error?.message})
    }
  });
}

