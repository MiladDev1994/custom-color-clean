import { app, BrowserWindow } from 'electron';
import WINDOW from './handler/createWindows.singleton';

if (require('electron-squirrel-startup')) {
  app.quit();
}

WINDOW.initialize()
import "./handler/all.handler"
