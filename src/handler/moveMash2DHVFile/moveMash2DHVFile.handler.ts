import path from "path"
import fs from "fs"
import { ipcMain } from "electron"
import ENV from "../../singleton/env"
const featurePath = ENV.FEATURE_ANALYZER_PATH

ipcMain.on("moveMash2DHVFile", async (event) => {
    const oldPath = path.join(featurePath, "BehIabi", "Mean2DH_V.xml");
    const newPath = path.join(featurePath, "Hesaab", "Mean2DH_V.xml");
  
    fs.rename(oldPath, newPath, (err) => {
        if (err) return event.sender.send("moveMash2DHVFile_chanel",{status: false, message: err}) 
        return event.sender.send("moveMash2DHVFile_chanel",{status: true, message: "moveMash2DHVFile moved"}) 
    })
})


export default ipcMain
