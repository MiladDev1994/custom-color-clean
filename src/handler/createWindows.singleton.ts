import { BrowserWindow, app } from "electron";
let WindowInstance: any
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;


class WindowSingleton {
    windows: any;
    constructor() {
        if (WindowInstance) {
          throw new Error("You can only create one instance!");
        }
        WindowInstance = this;
    }

    private createWindow(){
        const mainWindow = new BrowserWindow({
          height: 600,
          width: 800,
          webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
          },
        });
      
        mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
        this.windows = mainWindow
        mainWindow.webContents.openDevTools();
    };
    
    initialize() {
        app.on('ready', this.createWindow);
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

    get() {
        return this.windows
    }
}

const WINDOW = new WindowSingleton()

export default WINDOW;