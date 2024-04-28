import { ipcMain } from "electron";


function quitApp(WINDOW: any) {
    ipcMain.handle('quit', async (event) => {
        WINDOW.close();
    });
}


export default quitApp