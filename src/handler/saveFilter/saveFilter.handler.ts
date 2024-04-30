import { ipcMain } from "electron";
import { prepareSaveFilesToDirectory } from "./saveFilter.service";




ipcMain.handle('dialog:saveFile', async (event, directoryPath, filters, configs) => await prepareSaveFilesToDirectory(directoryPath, filters, configs));

export default ipcMain