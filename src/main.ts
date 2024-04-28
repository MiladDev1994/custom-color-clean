import { app, BrowserWindow } from 'electron';
import dotenv from "dotenv"
import WINDOW from './handler/createWindows.singleton';
import SEED from '../configs/readSeed.singleton';
import selectedPath from './handler/windows/selectPath';
import quitApp from './handler/windows/quitApp';
import minimizeApp from './handler/windows/minimizeApp';
dotenv.config()

if (require('electron-squirrel-startup')) {
  app.quit();
}

const windowAction = {
  selectedPath,
  quitApp,
  minimizeApp
}

SEED.create()
WINDOW.initialize(windowAction)

import "./handler/all.handler"

