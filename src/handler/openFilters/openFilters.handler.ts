import path from "path"
import fs from "fs"
import { ipcMain } from "electron";
import FILTERS from "../../singleton/filters.singleton";
import APP_DATA from "../../singleton/appData.singleton";
import HISTS from "../../singleton/hists.singleton";

ipcMain.handle('dialog:openFilters', async (event, data) => {
    try {
        const timestamp = data.split("\\").pop().split("_").pop()
        const filterPath = `C:\\scpc\\saves`
        const readDir = fs.readdirSync(filterPath)
        const readFilterFile = readDir.find((ele: any) => ele.replace(".json", "").split("_").includes(timestamp))
        if (!readFilterFile) return event.sender.send("openFilters_chanel", {status: false, error: "فایل یافت نشد"})
        
        const readFiltersFile = fs.readFileSync(path.join(filterPath, readFilterFile), "utf8")
        const parsFilters = JSON.parse(readFiltersFile)
        FILTERS.set(parsFilters.filters)
        APP_DATA.set(parsFilters.appData)
        HISTS.set(parsFilters.hists)
        console.log(APP_DATA.getAppData())
        return event.sender.send("openFilters_chanel", {status: true, filters: parsFilters})
    } catch (error) {
        return event.sender.send("openFilters_chanel", {status: false, error: "مسیر مورد نظر یافت نشد"})
    }
})


export default ipcMain