const { ipcMain } = require("electron")
const { MainWindow } = require("../singleton")


ipcMain.on('minimize', async (event) => {
    MainWindow.getWindows()?.[0]?.minimize();
});



module.exports = ipcMain