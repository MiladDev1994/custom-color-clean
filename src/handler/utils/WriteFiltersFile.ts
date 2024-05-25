import fs from "fs";
import path from "path";
import FILTERS from "../../singleton/filters.singleton";
import colors from "colors"
import APP_DATA from "../../singleton/appData.singleton";
import HISTS from "../../singleton/hists.singleton";


export async function WriteFiltersFile(timestamp: number) {
    const appData = APP_DATA.getAppData()
    const appInformation = {
        filters: FILTERS.getAll(),
        appData,
        hists: HISTS.get()
    }
    try {
        fs.writeFileSync(path.join("C:\\scpc\\saves", `${appData.app_name}_${timestamp}.json`), JSON.stringify(appInformation, null, 4))
    } catch (error) {
        console.log(colors.red("cant save filter file"))
    }
}