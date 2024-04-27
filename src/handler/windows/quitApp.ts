import { app, ipcMain } from "electron";


ipcMain.on('quit', async (event) => {
    app.quit();
});


module.exports = {ipcMain}