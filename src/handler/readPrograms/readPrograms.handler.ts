
import { ipcMain } from "electron"
import { getAllPrograms } from "./readPrograms.service"

ipcMain.on("readPrograms", async (event) => {
    
    const programs = await getAllPrograms()
    return event.sender.send("readPrograms_chanel", {status: true, programs})
})


export default ipcMain
