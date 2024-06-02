import fs from 'fs';
import path from 'path';
import { ipcMain } from "electron"
import { getAllApps } from './getAppsList.service';

ipcMain.on("getAppsList", async (event) => {
    try {
        // const filtersList = fs.readdirSync("C:\\scpc\\saves")
        const appsList = await getAllApps()
        return event.sender.send("getAppsList_chanel", {status: true, list: appsList})
    } catch (error) {
        return event.sender.send("getAppsList_chanel", {status: true, error: "فیلتر یافت نشد"})
    }
})


export default ipcMain
