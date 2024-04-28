import { ipcMain, dialog } from "electron"


function selectedPath(WINDOW: any) {
  ipcMain.handle("dialog:selectedPath", async () => {
    // console.log(WINDOW.get())
    const { canceled, filePaths } = await dialog.showOpenDialog(WINDOW, {
        properties: ['openDirectory'],
      })
    if (canceled) {
      return
    } else {
      return filePaths?.[0]
    }
  })
}

export default selectedPath