import path from "path"
import fs from "fs"
import { ipcMain } from "electron"
import HISTS from "../../singleton/hists.singleton"
import ENV from "../../singleton/env"
import APP_DATA from "../../singleton/appData.singleton"
import FILTERS from "../../singleton/filters.singleton"
const featurePath = ENV.FEATURE_ANALYZER_PATH

ipcMain.on("redHists", async (event) => {
    if(fs.existsSync(path.join(featurePath, "hists.json"))) {
      fs.readFile(path.join(featurePath, "hists.json"), 'utf8', (err, data) => {
        if (err) {
          return event.sender.send('redHists_chanel', {status: false,  err: err.message });
        }
        
        try {
          const chartData = JSON.parse(data);
          const tempFilter = APP_DATA.getTempValue()
          FILTERS.push(tempFilter)
          const filters = FILTERS.getAll()
  
          HISTS.set(chartData)
          return event.sender.send('redHists_chanel', {
            status: true,
            data: { hists: HISTS.get(), appData: APP_DATA.getAppData(), filters},
            message: "اطلاعات دریافت شد"
          });
        } catch (error) {
          HISTS.reset()
          return event.sender.send('redHists_chanel', {status: false, message: "ساختار فایل hisit.json اشتباه است"})
        }
      });
    }
})


export default ipcMain
