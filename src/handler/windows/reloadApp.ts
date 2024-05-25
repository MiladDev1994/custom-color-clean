import { ipcMain } from "electron";


function reloadApp(WINDOW: any) {
    ipcMain.handle('reload', async (event) => {
        WINDOW.reload();
    });
}


export default reloadApp