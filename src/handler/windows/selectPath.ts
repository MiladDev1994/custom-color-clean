import { ipcMain, dialog } from "electron"
import WINDOW from "../createWindows.singleton"


ipcMain.handle("dialog:selectedPath", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(WINDOW.get(), {
      properties: ['openDirectory'],
    })
  if (canceled) {
    return
  } else {
    return filePaths?.[0]
  }
})

export default ipcMain