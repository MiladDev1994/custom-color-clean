import { ipcMain } from "electron"
import FILTERS from "../../singleton/filters.singleton"

ipcMain.on("addFilter", async (event, value) => {
    FILTERS.push(value)
    const filters = FILTERS.getAll()
    return event.sender.send("addFilter_chanel", {status: true, filters})
        
})

ipcMain.on("deleteFilter", async (event, id) => {
    FILTERS.deleteById(id)
    const filters = FILTERS.getAll()
    return event.sender.send("deleteFilter_chanel", {status: true, filters, deleted: id})
})


ipcMain.on("updateFilter", async (event, id) => {
    const filters = FILTERS.getAll()
    const newFilter = filters.filter(filter => filter.id !== id)
    FILTERS.set(newFilter)
    return event.sender.send("updateFilter_chanel", {status: true, filters})
})


export default ipcMain

