import path from "path"
import fs from "fs"
import { ipcMain } from "electron"
import HISTS from "../../singleton/hists.singleton"
const featurePath = process.env.ELECTRON_APP__FEATURE_ANALYZER_PATH

ipcMain.on("redHists", async (event) => {
    if(fs.existsSync(path.join(featurePath, "hists.json"))) {
      fs.readFile(path.join(featurePath, "hists.json"), 'utf8', (err, data) => {
        if (err) {
          return event.sender.send('redHists_chanel', {status: false,  err: err.message });
        }
        const chartData = JSON.parse(data);
        HISTS.set(data)
        return event.sender.send('redHists_chanel', {status: true, chartData});
      });
    }
})


export default ipcMain
