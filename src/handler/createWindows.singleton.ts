import { BrowserWindow, app, ipcMain } from "electron";
let WindowInstance: any
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;


class WindowSingleton {
    // windows: any = {};
    constructor() {
        if (WindowInstance) {
          throw new Error("You can only create one instance!");
        }
        WindowInstance = this;
    }

    private createWindow(action?: any){
      const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        frame: false,
        webPreferences: {
          preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
      });

      
      mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
      mainWindow.maximize()
      mainWindow.webContents.openDevTools();

      Object.keys(action).forEach(act => {
        action[act as any](mainWindow)
      })
    };
    
    initialize(action: any) {
      app.on('ready', () => this.createWindow(action));
      app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit();
        }
      });
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow();
        }
      });
    }
    
}

const WINDOW = new WindowSingleton()

export default WINDOW;