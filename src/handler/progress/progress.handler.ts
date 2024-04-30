
import path from "path"
import fs from "fs"
import { ipcMain } from "electron"
import ENV from "../../singleton/env"
const featurePath = ENV.FEATURE_ANALYZER_PATH

ipcMain.on("progress", async (event, type) => {
    const progressPath = type === "SCATTER" ? path.join(featurePath, "BehIabi", "Progress.txt") : path.join(featurePath, "Progress.txt")

    if(fs.existsSync(progressPath)) {
        fs.readFile(progressPath, 'utf8', (err, data) => {
            return event.sender.send("progress_chanel", Number(data))
        })
    } else {
        return event.sender.send("progress_chanel", 0)
    }
})


export default ipcMain

