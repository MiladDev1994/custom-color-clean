import path from "path"
import { ipcMain } from "electron"
import { readHVImages, readOptimalPoint, scanConfusion } from "./readConfusion.service"
import ENV from "../../singleton/env"
import APP_DATA from "../../singleton/appData.singleton"
import FILTERS from "../../singleton/filters.singleton"
const featurePath = ENV.FEATURE_ANALYZER_PATH

ipcMain.on("readConfusion", async (event) => {
  const confusionPath = path.join(featurePath, "BehIabi", "confusions")
  const scanFolders = scanConfusion(confusionPath);
  const tempFilter = APP_DATA.getTempValue()
  const optimalPoint = readOptimalPoint(path.join(featurePath, "BehIabi", "optimal.txt"))
  const HV_images = readHVImages(path.join(featurePath, "BehIabi"))
  
  let type = "create";
  if (tempFilter.id) {
    FILTERS.patch(tempFilter.id, {...tempFilter, confusion: scanFolders.data, optimalPoint, HV_images});
    type = "patch";
  } 
  else FILTERS.push({...tempFilter, confusion: scanFolders.data, optimalPoint, HV_images})
  APP_DATA.setIsChanged()

  const filters = FILTERS.getAll()

  return event.sender.send(
    "readConfusion_chanel", {
    status: scanFolders.status,
    data: scanFolders.status ? {appData: APP_DATA.getAppData(), filters, type} : {},
    message: scanFolders.message
  })
  

})


export default ipcMain
