import { ipcMain } from "electron"
import PROGRAM_DATA from "../../singleton/programData.singleton"
import { CONFUSION } from "../../singleton/confusion.singleton"
import HISTS from "../../singleton/hists.singleton"

ipcMain.on("existAppDataChecker", async (event) => {
    const appData = PROGRAM_DATA.get()
    const confusion = CONFUSION.get()
    const hists = HISTS.get()
    return event.sender.send("existAppDataChecker_chanel", {appData, confusion, hists})
        
})


export default ipcMain

