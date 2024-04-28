import { ipcMain } from "electron";


function minimizeApp(WINDOW: any) {
    ipcMain.handle('minimize', async (event) => {
        WINDOW.minimize();
    });

}



export default minimizeApp