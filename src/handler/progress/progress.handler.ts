
import path from "path"
import fs from "fs"
import { ipcMain } from "electron"
import ENV from "../../singleton/env"
import APP_DATA from "../../singleton/appData.singleton"
const featurePath = ENV.FEATURE_ANALYZER_PATH

ipcMain.on("progress", async (event, type) => {
    const progressPath = type === "SCATTER" ? path.join(featurePath, "BehIabi", "Progress.txt") : path.join(featurePath, "Progress.txt")
    const {filter_type} = APP_DATA.getTempValue()

    if(fs.existsSync(progressPath)) {
        fs.readFile(progressPath, 'utf8', (err, data) => {
            return event.sender.send("progress_chanel", {progress: Number(data), filter_type})
        })
    } else {
        return event.sender.send("progress_chanel", {progress: 0, filter_type})
    }
})


export default ipcMain

