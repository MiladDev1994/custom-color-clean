
import fs from "fs";
import { js2xml } from "xml-js";
const { execFile, spawn, exec, execFileSync } = require('child_process');

const toXmlOption =  { 
    compact: true,
    ignoreComment: true,
    ignoreDeclaration: false,
    spaces: 4
}


export function OneDimension(value: any) {
    const {app_name, filter_name, healthy, not_healthy, filter_type, app_type, product_type, removeBlueBack} = value

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


    // try {
    if(fs.existsSync("C:\scpc\featureAnalyzer\\" + 'Progress.txt')) {
      fs.unlink("C:\scpc\featureAnalyzer\\" + 'Progress.txt', (err) => {
        if (err) {
            console.log(err)
        //   Loggers.error("Error Found:", err);
          // event.sender.send('Remove Progress', err);
        }
      });
    }
    if(fs.existsSync("C:\scpc\featureAnalyzer\\" + 'hists.json')) {
      fs.unlink("C:\scpc\featureAnalyzer\\" + 'hists.json', (err) => {
        if (err) {
        //   Loggers.error("Error Found:", err);
          console.log(err)
          // event.sender.send('Remove Progress', err);
        }
      });
    }
    // } catch {
    //   Loggers.error("error in removing Progress.txt");
    // }

    const objToXml = js2xml(obj as any, toXmlOption)
    fs.writeFile(process.env.ELECTRON_APP_CREATE_CHART_DATA + "config.xml", objToXml , (err) => {
        if (err) {
            console.log(err)
        //   Loggers.error("Error Found:", err);
        //   return event.sender.send('chartData', {status: false, error: err});
        }
        // execFile(`HistogramGenerator.exe`, { cwd: process.env.ELECTRON_APP_CREATE_CHART_DATA }, (error, stdout, stderr) => {
        //   console.log(1, error)
        //   console.log(2, stdout)
        //   console.log(3, stderr)
        //   if (error) {
        //     // Loggers.error(`error: ${error.message}`);
        //     event.sender.send('chartData', {status: false, error: error, message: error.message});
        //     return;
        //   }
        //   if(stdout) {
        //     // console.log(stdout);
        //     fs.readFile(process.env.ELECTRON_APP_CREATE_CHART_DATA + 'hists.json', 'utf8', (err, data) => {
        //       if (err) {
        //         Loggers.error(err);
        //         event.sender.send('chartData', {status: false,  err: err });
        //         return;
        //       }
        //       const chartData = JSON.parse(data);
        //       // isLoadingChartData = false;
        //       event.sender.send('chartData', {status: true, chartData});
        //     });
        //   }
        //   if (stderr) {
        //     // Loggers.error(`stderr: ${stderr}`);
        //   }
        // });
  
        const bat = spawn(`HistogramGenerator.exe`, { cwd: process.env.ELECTRON_APP_CREATE_CHART_DATA, shell: true});
  
        bat.stdout.on('data', (res: any) => {
          // console.log("data", res.toString())
          console.log(res)
          return true
            // if(fs.existsSync(process.env.ELECTRON_APP_CREATE_CHART_DATA + 'hists.json')) {
            //   fs.readFile(process.env.ELECTRON_APP_CREATE_CHART_DATA + 'hists.json', 'utf8', (err, data) => {
            //     if (err) {
            //     //   Loggers.error(err);
            //       console.log(err)
            //     //   return event.sender.send('chartData', {status: false,  err: err });
            //     }
            //     // console.log(data)
            //     const chartData = JSON.parse(data);
            //     // return event.sender.send('chartData', {status: true, chartData});
            //   });
            // }

        });
        
        bat.stderr.on('data', (error: any) => {
          // console.log("error", error)
        //   return event.sender.send('chartData', {status: false, error: error, message: error});
          return false
        });
        
        bat.on('exit', (code: any) => {
          console.log('exit', code)
          return false
          // setTimeout(() => {
          //   if(fs.existsSync(process.env.ELECTRON_APP_CREATE_CHART_DATA + 'hists.json')) {
          //     fs.readFile(process.env.ELECTRON_APP_CREATE_CHART_DATA + 'hists.json', 'utf8', (err, data) => {
          //       if (err) {
          //         Loggers.error(err);
          //         return event.sender.send('chartData', {status: false,  err: err });
          //       }
          //       // console.log(data)
          //       const chartData = JSON.parse(data);
          //       return event.sender.send('chartData', {status: true, chartData});
          //     });
          //   }
          // }, 3000)
        }); 
  
      });

    return true
}


export function TwoDimension(value: any) {
    const {app_name, filter_name, healthy, not_healthy, influenceTop, influenceDown} = value
    return true
}
