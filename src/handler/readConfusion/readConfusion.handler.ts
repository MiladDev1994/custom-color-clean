import path from "path"
import { ipcMain } from "electron"
import { scanConfusion } from "./readConfusion.service"
import ENV from "../../singleton/env"
import APP_DATA from "../../singleton/appData.singleton"
import FILTERS from "../../singleton/filters.singleton"
const featurePath = ENV.FEATURE_ANALYZER_PATH

ipcMain.on("readConfusion", async (event) => {
  const confusionPath = path.join(featurePath, "BehIabi", "confusions")
  const scanFolders = scanConfusion(confusionPath);
  const tempFilter = APP_DATA.getTempValue()

  FILTERS.push({...tempFilter, confusion: scanFolders.data})
  const filters = FILTERS.getAll()

  return event.sender.send(
    "readConfusion_chanel", {
    status: scanFolders.status,
    data: scanFolders.status ? {appData: APP_DATA.getAppData(), filters} : {},
    message: scanFolders.message
  })
})


export default ipcMain
