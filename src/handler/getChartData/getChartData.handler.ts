import { ipcMain } from "electron"
import { OneDimension, TwoDimension } from "./getChartData.service"

ipcMain.on("getChartData", (event, value) => {
    const {filter_type} = value

    let completedEXE = false;
    if (filter_type === "SCATTER") completedEXE = TwoDimension(value)
    else completedEXE = OneDimension(value)
})


export default ipcMain

