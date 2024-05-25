import { ipcMain } from "electron"
import APP_DATA from "../../singleton/appData.singleton"
import { CONFUSION } from "../../singleton/confusion.singleton"
import HISTS from "../../singleton/hists.singleton"
import FILTERS from "../../singleton/filters.singleton"

ipcMain.on("existAppDataChecker", async (event) => {
    const appData = APP_DATA.getAppData()
    // console.log(appData)
    const hists = HISTS.get()
    const filters = FILTERS.getAll()
    return event.sender.send("existAppDataChecker_chanel", {appData, hists, filters})
        
})


export default ipcMain

