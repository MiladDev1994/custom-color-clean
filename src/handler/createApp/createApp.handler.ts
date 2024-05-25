import { ipcMain } from "electron"
import APP_DATA from "../../singleton/appData.singleton"
import FILTERS from "../../singleton/filters.singleton"
import HISTS from "../../singleton/hists.singleton"

ipcMain.on("createApp", async (event, value) => {
    APP_DATA.reset()
    FILTERS.reset()
    HISTS.reset()
    APP_DATA.set(value)

    return event.sender.send("createApp_chanel", {status: true, addData: APP_DATA.getAppData()})
})


export default ipcMain
