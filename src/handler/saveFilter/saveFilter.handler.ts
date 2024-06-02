import fs from "fs"
import path from "path"
import { ipcMain } from "electron"; 
import FILTERS from "../../singleton/filters.singleton";
import * as filterType from "./saveFilter.service"
import { WriteFiltersFile } from "../utils/WriteFiltersFile";
import APP_DATA from "../../singleton/appData.singleton";
import { RemoveFile } from "../utils/RemoveFile";



ipcMain.handle('dialog:saveFilter', async (event, data) => {
    const appData = APP_DATA.getAppData()
    const {savePath, type, scatterPointLocation} = data
    const saveDirectory = "C:\\scpc\\saves"
    if (!fs.existsSync(saveDirectory)) fs.mkdirSync(saveDirectory)


    try {

        let timestamp = new Date().getTime()
        let saveAddress = savePath
        if (type === "save" && appData?.savePath) {
            await RemoveFile(appData?.savePath)
            timestamp = Number(appData?.savePath.split("\\").pop().split("_").pop().replace(".xml", ""))
            const splitSavePath = appData?.savePath.split("\\")
            splitSavePath.pop()
            const newSavePath = splitSavePath.join("\\")
            saveAddress = newSavePath
        }
        const folderName = `${appData.app_name}_${timestamp}`;
        if (!fs.existsSync(path.join(saveAddress, folderName))) fs.mkdirSync(path.join(saveAddress, folderName))

        const saveResult = await filterType.SaveFilter({
            filters: FILTERS.getAll(),
            savePath: saveAddress,
            folderName,
            scatterPointLocation
        })
        
        APP_DATA.setSavePath(path.join(saveAddress, folderName))
        await WriteFiltersFile(folderName)
    
        event.sender.send("saveFilter_chanel", {status: true, appData: APP_DATA.getAppData()})
    } catch (error) {
        event.sender.send("saveFilter_chanel", {status: false, })
    }
});

export default ipcMain