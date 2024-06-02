import path from "path"
import fs from "fs"
import { ipcMain } from "electron";
import FILTERS from "../../singleton/filters.singleton";
import APP_DATA from "../../singleton/appData.singleton";
import HISTS from "../../singleton/hists.singleton";

ipcMain.handle('dialog:openFilters', async (event, data) => {
    try {
        // const timestamp = data.split("\\").pop().split("_").pop()
        // const filterName = data.split("\\").pop().split("_").shift()
        // const filtersPath = path.join(`C:\\scpc\\saves`, timestamp)
        // if (!fs.existsSync(filtersPath)) return event.sender.send("openFilters_chanel", {status: false, error: "فیلتر مورد نظر یافت نشد"})
        // const readDir = fs.readdirSync(filtersPath)

        
        // const readFilterFile = readDir.find((ele: any) => ele.replace(".json", "").split("_").includes(timestamp))
        // if (!readFilterFile) return event.sender.send("openFilters_chanel", {status: false, error: "فایل یافت نشد"})
        
        // const readFiltersFile = fs.readFileSync(path.join(filtersPath, readFilterFile), "utf8")
        // const parsFilters = JSON.parse(readFiltersFile)
        

        const timestamp = data.split("\\").pop().split("_").pop()
        const filterName = data.split("\\").pop().split("_").shift()
        const filtersPath = path.join(`C:\\scpc\\saves`, data.split("\\").pop())
        if (!fs.existsSync(filtersPath)) return event.sender.send("openFilters_chanel", {status: false, error: "مسیر مورد نظر یافت نشد"})
        const readDir = fs.readdirSync(filtersPath)

        // console.log(filterName)
        if (!readDir.some((ele) => ele.replace(".json", "") === filterName)) return event.sender.send("openFilters_chanel", {status: false, error: "مسیر مورد نظر یافت نشد"})
        const filterNamePath = path.join(filtersPath, `${filterName}.json`)
        if (!fs.existsSync(filterNamePath)) return event.sender.send("openFilters_chanel", {status: false, error: "مسیر مورد نظر یافت نشد"})
        const readFiltersFile = fs.readFileSync(filterNamePath, "utf8")
        const parsFilters = JSON.parse(readFiltersFile)


        // const Mash2DH_VPath = path.join(filtersPath, "Mean2DH_V.xml")
        // if(fs.existsSync(Mash2DH_VPath)) fs.copyFileSync(Mash2DH_VPath, path.join("C:\\scpc\\featureAnalyzer\\Hesaab", "Mean2DH_V.xml"))
        FILTERS.set(parsFilters.filters)
        APP_DATA.set(parsFilters.appData)
        HISTS.set(parsFilters.hists)
        return event.sender.send("openFilters_chanel", {status: true, filters: parsFilters})
    } catch (error) {
        return event.sender.send("openFilters_chanel", {status: false, error: "مسیر مورد نظر یافت نشد"})
    }
})


export default ipcMain