import path from "path"
import fs from "fs"
import { ipcMain } from "electron"
import ENV from "../../singleton/env"
import FILTERS from "../../singleton/filters.singleton"
import { getSampleImages } from "../randomImage/randomImage.service"
import APP_DATA from "../../singleton/appData.singleton"

ipcMain.on("readResultData", async (event, id) => {
    const resultPath = path.join(ENV.FEATURE_ANALYZER_PATH, "results.json")
    try {
        const result = fs.readFileSync(resultPath, "utf8")
        const parseResult = JSON.parse(result)
        const filter = FILTERS.getById(id)
        const count = filter?.userData?.count
        const chartType = filter?.chart_type
        const images = await getSampleImages(["healthy", "nonHealthy"], parseResult, count, chartType)
        FILTERS.update(id, {result: parseResult, images})
        APP_DATA.setIsChanged()
        return event.sender.send("readResultData_chanel", {status: true, filters: FILTERS.getAll(), appData: APP_DATA.getAppData()})
    } catch (error) {
        FILTERS.update(id, {userData: {}, data: {}, goodDirection: false})
        return event.sender.send("readResultData_chanel", {status: false, error: "مشکل در خواندن فایل results.json"})
    }
})



export default ipcMain
