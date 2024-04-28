
import fs from "fs";
import path from "path";
import { js2xml } from "xml-js";
import { UnlinkFile } from "../utils/UnlinkFile";
import { WriteXmlFile } from "../utils/WriteXmlFile";
import createHttpError from "http-errors";
import { ExecFile } from "../utils/ExecFile";
const { execFile, spawn, exec, execFileSync } = require('child_process');



export async function OneDimension(event: any, value: any) {
    const { healthy, not_healthy, product_type, removeBlueBack } = value

    let isBackgroundBlue = false;
    switch (product_type.toUpperCase()) {
      case "MUNG":
      case "SUNFLOWERSEED":
        isBackgroundBlue = true;
        break;
    }

    let obj = {
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

    const featurePath = process.env.ELECTRON_APP__FEATURE_ANALYZER_PATH
    UnlinkFile(path.join(featurePath, 'config.xml'))
    UnlinkFile(path.join(featurePath, 'Progress.txt'))
    UnlinkFile(path.join(featurePath, 'hists.json'))
    await WriteXmlFile(obj, path.join(featurePath, "config.xml"))
    
    execFile(`HistogramGenerator.exe`, { cwd: featurePath }, (error: any, stdout: any, stderr: any) => {
      if (error) {
        return event.sender.send("getChartData_call", {status: false, message: error.message})
      }
      if(stdout) {
        return event.sender.send("getChartData_call", {status: true, data: stdout})
      }
      if (stderr) {
          return event.sender.send("getChartData_call", {status: false, message: error?.message})
      }
    });

}


export function TwoDimension(event: any, value: any) {
    const {app_name, filter_name, healthy, not_healthy, influenceTop, influenceDown} = value
    return true
}
