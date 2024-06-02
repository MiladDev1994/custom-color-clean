import { ipcMain } from "electron"
import { RemoveFile } from "../utils/RemoveFile"
import path from "path"

ipcMain.on("deleteApp", async (event, appName) => {
    const removeApp =  await RemoveFile(path.join("C:\\scpc\\saves", appName))
    if (!removeApp) return event.sender.send("deleteApp_chanel", {status: false, message: "برنامه حذف نشد"})
    return event.sender.send("deleteApp_chanel", {status: true, message: "برنامه با موفقیت حذف شد"})
})


export default ipcMain

