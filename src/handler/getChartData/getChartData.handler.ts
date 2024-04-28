import { ipcMain } from "electron"
import { OneDimension, TwoDimension } from "./getChartData.service"

ipcMain.on("getChartData", async (event, value) => {
    const {filter_type} = value

    try {
        if (filter_type === "SCATTER") TwoDimension(event, value)
        else await OneDimension(event, value)
    } catch (error) {
        return event.sender.send("getChartData_call", error)
    }
})


export default ipcMain

