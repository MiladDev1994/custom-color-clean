import { ipcMain } from "electron"
import * as ChartData from "./getChartData.service"

ipcMain.on("getChartData", async (event, value) => {
    const {filter_type} = value
    const dimension = filter_type === "SCATTER" ? "TWO" : "ONE"
    const newValue = {...value, dimension}

    try {
        await ChartData[dimension](event, newValue)
    } catch (error) {
        return event.sender.send("getChartData_chanel", error)
    }
})


export default ipcMain
