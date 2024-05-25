
import path from "path";
import { WriteXmlFile } from "../utils/WriteXmlFile";
import { RemoveFile } from "../utils/RemoveFile";
import APP_DATA from "../../singleton/appData.singleton";
import { Json2Xml } from "../utils/Json2Xml";
import ENV from "../../singleton/env";
import FILTERS from "../../singleton/filters.singleton";
const { execFile } = require('child_process');
const featurePath = ENV.FEATURE_ANALYZER_PATH


export async function LINE(event: any, value: any) {
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
        "removeBlueBack": appData?.removeBlueBack
      }
    };
    
    APP_DATA.setTempValue(value)
    await RemoveFile(path.join(featurePath, 'config.xml'))
    await RemoveFile(path.join(featurePath, 'Progress.txt'))
    await RemoveFile(path.join(featurePath, 'hists.json'))
    const objToXml = await Json2Xml(config)
    await WriteXmlFile(objToXml, path.join(featurePath, "config.xml"))
    
    execFile(`HistogramGenerator.exe`, { cwd: featurePath }, (error: any, stdout: any, stderr: any) => {
      if (error) {
        // APP_DATA.reset()
        return event.sender.send("getChartData_chanel", {status: false, message: error.message})
      }
      if(stdout) {
        return event.sender.send("getChartData_chanel", {status: true, data: stdout})
      }
      if (stderr) {
        // APP_DATA.reset()
        return event.sender.send("getChartData_chanel", {status: false, message: error?.message})
      }
    });

}


export async function SCATTER(event: any, value: any) {
  const { app_name, filter_name, healthy, not_healthy, product_type, app_type, removeBlueBack, filter_type, size_type, chart_type, influenceTop, influenceDown } = value
  const appData = APP_DATA.getAppData()
  
  let isPistachi = false;
  if (appData.product_type === "PISTACHIO") isPistachi = true

  let IsBackgroundBlue = false;
  if (Object.keys(appData).length) {
    switch (appData.product_type.toUpperCase()) {
      case "MUNG":
      case "SUNFLOWERSEED":
        IsBackgroundBlue = true;
        break;
    }
  } else {
    switch (product_type.toUpperCase()) {
      case "MUNG":
      case "SUNFLOWERSEED":
        IsBackgroundBlue = true;
        break;
    }
  }

  let config = {
    "_instruction": { "xml": { "_attributes": { "version": "1.0" } } },
    "opencv_storage": {
      "healthy": appData?.healthy ? `"${appData?.healthy.replace(/\\/g, "/")}"` : `"${healthy.replace(/\\/g, "/")}"`,
      "nonhealthy": appData?.not_healthy ? `"${appData?.not_healthy.replace(/\\/g, "/")}"` : `"${not_healthy.replace(/\\/g, "/")}"`,
      "influenceTop": Number(influenceTop),
      "influenceDown" : Number(influenceDown),
      isPistachi,
      IsBackgroundBlue,
      "removeBlueBack": appData.removeBlueBack,
    }
  };
  // console.log(config)
  // console.log(value)
  
  APP_DATA.setTempValue(value)


  await RemoveFile(path.join(path.join(featurePath, "BehIabi", "Progress.txt")))
  await RemoveFile(path.join(path.join(featurePath, "BehIabi", "config.xml")))
  await RemoveFile(path.join(path.join(featurePath, "BehIabi", "confusions")))
  await RemoveFile(path.join(path.join(featurePath, "BehIabi", "optimal.txt")))
  const objToXml = await Json2Xml(config)
  // console.log(objToXml)
  await WriteXmlFile(objToXml, path.join(featurePath, "BehIabi", "config.xml"))
  

  execFile(`HistogramSearch.exe`, { cwd: path.join(featurePath, "BehIabi") }, (error: any, stdout: any, stderr: any) => {
    if (error) {
      // APP_DATA.reset()
      return event.sender.send("getChartData_chanel", {status: false, message: error.message})
    }
    if(stdout) {
      return event.sender.send("getChartData_chanel", {status: true, data: stdout})
    }
    if (stderr) {
      // APP_DATA.reset()
      return event.sender.send("getChartData_chanel", {status: false, message: error?.message})
    }
  });
}

