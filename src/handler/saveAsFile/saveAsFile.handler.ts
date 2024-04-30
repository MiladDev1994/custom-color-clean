import { dialog, ipcMain } from "electron";


function SaveAs(WINDOW: any) {
    ipcMain.handle('dialog:saveAsFile', async (event) => {
        const { canceled, filePaths } = await dialog.showOpenDialog(WINDOW, {
          properties: ['openDirectory'],
          buttonLabel: "Save",
        //   multiSelections: false
        })
        if (canceled) {
          return
        } else {
          return filePaths?.[0]
        }
    });
}

export default SaveAs