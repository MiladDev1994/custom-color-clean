import path from "path"
import { ipcMain } from "electron"
import { readHVImages, readMash2DH_V, readOptimalPoint, scanConfusion } from "./readConfusion.service"
import ENV from "../../singleton/env"
import APP_DATA from "../../singleton/appData.singleton"
import FILTERS from "../../singleton/filters.singleton"
const featurePath = ENV.FEATURE_ANALYZER_PATH

ipcMain.on("readConfusion", async (event) => {
  const confusionPath = path.join(featurePath, "BehIabi", "confusions")
  const scanFolders = await scanConfusion(confusionPath);
  const tempFilter = APP_DATA.getTempValue()
  const optimalPoint = await readOptimalPoint(path.join(featurePath, "BehIabi", "optimal.txt"))
  const HV_images = await readHVImages(path.join(featurePath, "BehIabi"))
  const Mean2DH_V = await readMash2DH_V(path.join(ENV.FEATURE_ANALYZER_PATH, "BehIabi", "Mean2DH_V.xml")) // برای اضافه کردن اطلاعات فایل Mash2DH_V.xml به فیلتر 
  
  let type = "create";
  if (tempFilter.id) {
    FILTERS.patch(tempFilter.id, {...tempFilter, confusion: scanFolders.data, optimalPoint, HV_images, Mean2DH_V}); // برای اضافه کردن اطلاعات فایل Mash2DH_V.xml به فیلتر
    // FILTERS.patch(tempFilter.id, {...tempFilter, confusion: scanFolders.data, optimalPoint, HV_images});
    type = "patch";
  } 
  else FILTERS.push({...tempFilter, confusion: scanFolders.data, optimalPoint, HV_images, Mean2DH_V}) // برای اضافه کردن اطلاعات فایل Mash2DH_V.xml به فیلتر
  // else FILTERS.push({...tempFilter, confusion: scanFolders.data, optimalPoint, HV_images})
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
