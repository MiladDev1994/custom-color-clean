import { ipcMain } from "electron"
import * as ChartData from "./getChartData.service"

ipcMain.on("getChartData", async (event, value) => {
    const {filter_type} = value

    try {
        await ChartData[filter_type as "SCATTER"](event, value)
    } catch (error) {
        return event.sender.send("getChartData_chanel", error)
    }
})


export default ipcMain
