import path from "path"
import { app, BrowserWindow, ipcMain } from 'electron';
import dotenv from "dotenv"
import SEED from './singleton/readSeed.singleton';
import WINDOW from './handler/createWindows.singleton';
import selectedPath from './handler/windows/selectPath';
import quitApp from './handler/windows/quitApp';
import minimizeApp from './handler/windows/minimizeApp';
// import SaveAs from './handler/saveAsFile/saveAsFile.handler';
import reloadApp from "./handler/windows/reloadApp";
dotenv.config({ path: path.join(__dirname, '.env') })

if (require('electron-squirrel-startup')) {
  app.quit();
}

const windowAction = {
  selectedPath,
  quitApp,
  minimizeApp,
  // SaveAs,
  reloadApp
}

// SEED.create()
WINDOW.initialize(windowAction)

import "./handler/handlers.aggregation"


