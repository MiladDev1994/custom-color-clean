import path from "path"
import { ipcMain } from "electron"
import { scanConfusion } from "./readConfusion.service"
const featurePath = process.env.ELECTRON_APP__FEATURE_ANALYZER_PATH

ipcMain.on("readConfusion", async (event) => {
  const confusionPath = path.join(featurePath, "BehIabi", "confusions")
  const scanFolders = scanConfusion(confusionPath);
  return event.sender.send(
    "readConfusion_chanel", {
    status: scanFolders.status,
    data: scanFolders.status ? {...scanFolders.data, directory: confusionPath} : {},
    message: scanFolders.message
  })
})


export default ipcMain
