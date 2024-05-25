import { ipcMain } from "electron";
import FILTERS from "../../singleton/filters.singleton";
import { getSampleImages } from "./randomImage.service";


ipcMain.on("randomImage", async (event, data) => {
    const {type, id} = data
    
    const filter = FILTERS.getById(id)
    const images = filter.images
    const result = filter.result
    const count = filter?.filterValues?.count
    const chartType = filter?.chart_type ?? "total"
    const readImages = await getSampleImages([type], result, count, chartType, images)
    FILTERS.update(id, {images: readImages})
    event.sender.send("randomImage_chanel", {status: true, filters: FILTERS.getAll()})
})


export default ipcMain