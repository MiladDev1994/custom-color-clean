import { ipcMain } from "electron"
import APP_DATA from "../../singleton/appData.singleton"
import { CONFUSION } from "../../singleton/confusion.singleton"
import HISTS from "../../singleton/hists.singleton"
import FILTERS from "../../singleton/filters.singleton"

ipcMain.on("deleteIdealPoints", async (event, id) => {
    FILTERS.deleteIdealPoints(id)
    const filters = FILTERS.getAll()
    return event.sender.send("deleteIdealPoints_chanel", filters)
        
})


export default ipcMain

