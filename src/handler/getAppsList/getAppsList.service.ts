import fs from 'fs';
import path from 'path';

export async function getAllApps() {
    const appsList: string[] = [];
    const savePath = "C:\\scpc\\saves"
    if (!fs.existsSync(savePath)) return appsList;
    const walkDirectory = fs.readdirSync(savePath)
    walkDirectory.forEach((ele) => {
        const filePath = path.join(savePath, ele)
        if (!fs.statSync(filePath).isDirectory()) return

        const readFileInDirectory = fs.readdirSync(filePath)
        if (!readFileInDirectory.includes(`${ele.split("_").shift()}.json`)) return
        appsList.push(ele)
        // console.log(filePath)
    })
    return appsList;
}