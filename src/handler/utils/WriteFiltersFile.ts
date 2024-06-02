import fs from "fs";
import path from "path";
import FILTERS from "../../singleton/filters.singleton";
import colors from "colors"
import APP_DATA from "../../singleton/appData.singleton";
import HISTS from "../../singleton/hists.singleton";


export async function WriteFiltersFile(folderName: string) {
    const appData = APP_DATA.getAppData()
    const appInformation = {
        filters: FILTERS.getAll(),
        appData,
        hists: HISTS.get()
    }
    try {
        const savePath = `C:\\scpc\\saves\\${folderName}`
        if (!fs.existsSync(savePath)) fs.mkdirSync(savePath)
        fs.writeFileSync(path.join(savePath, `${appData.app_name}.json`), JSON.stringify(appInformation, null, 4))
    } catch (error) {
        console.log(colors.red("cant save filter file"))
    }
}