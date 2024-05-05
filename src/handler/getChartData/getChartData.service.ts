
import path from "path";
import { WriteXmlFile } from "../utils/WriteXmlFile";
import { RemoveFile } from "../utils/RemoveFile";
import APP_DATA from "../../singleton/appData.singleton";
import { Json2Xml } from "../utils/Json2Xml";
import ENV from "../../singleton/env";
import FILTERS from "../../singleton/filters.singleton";
const { execFile } = require('child_process');
const featurePath = ENV.FEATURE_ANALYZER_PATH


export async function ONE(event: any, value: any) {
  const { app_name, filter_name, healthy, not_healthy, product_type, app_type, removeBlueBack, filter_type, size_type, chart_type, influenceTop, influenceDown } = value
  const appData = APP_DATA.getAppData()


    let isBackgroundBlue = false;
    if (Object.keys(appData).length) {
      switch (appData.product_type.toUpperCase()) {
        case "MUNG":
        case "SUNFLOWERSEED":
          isBackgroundBlue = true;
          break;
      }
    } else {
      switch (product_type.toUpperCase()) {
        case "MUNG":
        case "SUNFLOWERSEED":
          isBackgroundBlue = true;
          break;
      }
    }

    let config = {
      "_instruction": { "xml": { "_attributes": { "version": "1.0" } } },
      "opencv_storage": {
        "healthy": appData?.healthy ? `"${appData?.healthy.replace(/\\/g, "/")}"` : `"${healthy.replace(/\\/g, "/")}"`,
        "nonhealthy": appData?.not_healthy ? `"${appData?.not_healthy.replace(/\\/g, "/")}"` : `"${not_healthy.replace(/\\/g, "/")}"`,
        "ObjectType": appData?.product_type ? appData?.product_type.toLowerCase() : product_type.toLowerCase(),
        "IsBackgroundBlue" : isBackgroundBlue,
        "AddHoleHistogram": true,
        "removeBlueBack": appData?.removeBlueBack ? appData?.removeBlueBack :  removeBlueBack
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
        APP_DATA.set(value)
        return event.sender.send("getChartData_chanel", {status: true, data: stdout})
      }
      if (stderr) {
          return event.sender.send("getChartData_chanel", {status: false, message: error?.message})
      }
    });

}


export async function TWO(event: any, value: any) {
  const { app_name, filter_name, healthy, not_healthy, product_type, app_type, removeBlueBack, filter_type, size_type, chart_type, influenceTop, influenceDown } = value
  const appData = APP_DATA.getAppData()

  let config = {
    "_instruction": { "xml": { "_attributes": { "version": "1.0" } } },
    "opencv_storage": {
      "healthy": appData?.healthy ? `"${appData?.healthy.replace(/\\/g, "/")}"` : `"${healthy.replace(/\\/g, "/")}"`,
      "nonhealthy": appData?.not_healthy ? `"${appData?.not_healthy.replace(/\\/g, "/")}"` : `"${not_healthy.replace(/\\/g, "/")}"`,
      "influenceTop": Number(influenceTop),
      "influenceDown" : Number(influenceDown),
    }
  };

  await RemoveFile(path.join(path.join(featurePath, "BehIabi", "config.xml")))
  await RemoveFile(path.join(path.join(featurePath, "BehIabi", "confusions")))
  await RemoveFile(path.join(path.join(featurePath, "BehIabi", "Progress.txt")))
  const objToXml = await Json2Xml(config)
  await WriteXmlFile(objToXml, path.join(featurePath, "BehIabi", "config.xml"))
  
  APP_DATA.set(value)

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

