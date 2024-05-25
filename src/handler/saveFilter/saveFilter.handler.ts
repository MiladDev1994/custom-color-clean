import fs from "fs"
import path from "path"
import { ipcMain } from "electron"; 
import FILTERS from "../../singleton/filters.singleton";
import * as filterType from "./saveFilter.service"
import { WriteFiltersFile } from "../utils/WriteFiltersFile";
import APP_DATA from "../../singleton/appData.singleton";
import { RemoveFile } from "../utils/RemoveFile";


let numberOfChart: any = {}
ipcMain.handle('dialog:saveFilter', async (event, data) => {
    const appData = APP_DATA.getAppData()
    const {savePath, type} = data
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
        const folderName = `customProgramDir_${timestamp}`;
        if (!fs.existsSync(path.join(saveAddress, folderName))) fs.mkdirSync(path.join(saveAddress, folderName))
            
        FILTERS.getAll().forEach(async (filter: any) => {
            if (filter.filter_type === "Conclusion") return;
    
            const filterBaseName = `${filter?.filter_type.toLowerCase()}${filter?.chart_type ?? ""}` // example ==> lineHue | lineVal
            if (!numberOfChart?.[filterBaseName]) numberOfChart[filterBaseName] = 1
            else numberOfChart[filterBaseName]++
    
            const fileData = {
                savePath: saveAddress,
                filter,
                folderName,
                filterBaseName,
                numberOfChart: numberOfChart[filterBaseName] < 10 ? `0${numberOfChart[filterBaseName]}` : numberOfChart[filterBaseName]
            }
            await filterType[filter.filter_type as "LINE"](fileData)
            numberOfChart = {}
        })

        APP_DATA.setSavePath(path.join(saveAddress, folderName))
        await WriteFiltersFile(timestamp)
    
        event.sender.send("saveFilter_chanel", {status: true, appData: APP_DATA.getAppData()})
    } catch (error) {
        event.sender.send("saveFilter_chanel", {status: false, })
    }
});

export default ipcMain