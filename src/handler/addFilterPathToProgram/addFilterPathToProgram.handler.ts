import fs from 'fs';
import path from 'path';
import { ipcMain } from "electron"
import TemplateModel from '../../DB/models';
import { RemoveFile } from '../utils/RemoveFile';
import { SaveFilter } from '../saveFilter/saveFilter.service';
import convert from 'xml-js';
import { getAllPrograms } from '../readPrograms/readPrograms.service';

ipcMain.on("addFilterPathToProgram", async (event, value) => {

    const {programId, filterName, scatterPointLocation} = value
    const program: any = await TemplateModel.findOne({
        raw: true,
        where: {
            sorchin_template_id: programId,
        },
    })
    if (!program) return event.sender.send("addFilterPathToProgram_chanel", {status: false, error: "پروگرم یافت نشد", })
    const filterPath = path.join("C:\\scpc\\saves", filterName)
        
    const readDir = fs.readdirSync(filterPath);
    if (!readDir || !readDir.includes(`${filterName.split("_")?.shift()}.json`)) return event.sender.send("addFilterPathToProgram_chanel", {status: false, error: "فیلتر یافت نشد", })
    const readFilterData = fs.readFileSync(path.join("C:\\scpc\\saves", filterName, `${filterName.split("_")?.shift()}.json`), "utf8")
    const parseFilterData = JSON.parse(readFilterData)

    
    let filterSavedPath = parseFilterData?.appData?.savePath
    if (!checkExistFilterInSavePath(filterSavedPath)) {
        await RemoveFile(path.join("C:\\scpc\\saves", filterName, "forProgram"))
        fs.mkdirSync(path.join("C:\\scpc\\saves", filterName, "forProgram"))
        filterSavedPath = await SaveFilter({
            filters: parseFilterData.filters,
            savePath: path.join("C:\\scpc\\saves", filterName),
            folderName: "forProgram",
            scatterPointLocation
        })
    }
    if (!filterSavedPath) return event.sender.send("addFilterPathToProgram_chanel", {status: false, error: "مسیر یافت نشد", })


        
    
    const programPath = program?.template_path
    
    let programData = fs.readFileSync(programPath, 'utf8');
    const options = { compact: true, ignoreDeclaration: false, spaces: 4 };
    const parsProgram: any = convert.xml2js(programData, options);
    
    if (programData.includes('<filterPath>')) {
        const openFilterPathIndex = programData.indexOf('<filterPath>')
        const closeFilterPathIndex = programData.indexOf('</filterPath>') + 14
        let oldFilterPath = ""
        for(let i=openFilterPathIndex; i<=closeFilterPathIndex; i++) {
          oldFilterPath += programData[i]
        }
        programData = programData.replace(oldFilterPath, "")
    }

    let maxAttribute = 0
    Object.keys(parsProgram.opencv_storage).forEach((ele) => {
      if (!ele.split("_").includes("attribute")) return
      if (+ele.split("_").pop() > maxAttribute) maxAttribute = +ele.split("_").pop()
    })
    
    // Define a function to insert a new element after a specific comment
    function insertAfterComment(xmlString: any, comment: any, newElement: any) {
      const commentRegex = new RegExp(`(</${comment}>)`);
      return xmlString.replace(commentRegex, `$1\n  ${newElement}`);
    }
    
    const newElement = `<filterPath>"${filterSavedPath}"</filterPath>`;
    const updatedXml = insertAfterComment(programData, `attribute_${maxAttribute}`, newElement);
    
    fs.writeFileSync(programPath, updatedXml);


    const programsList = await getAllPrograms()
    return event.sender.send("addFilterPathToProgram_chanel", {status: true, programsList})
})


const checkExistFilterInSavePath = (filterSavedPath: string) => {
    if (!filterSavedPath) return false
    const existFilter = fs.existsSync(filterSavedPath)
    // const readDirFilter = fs.readdirSync(filterSavedPath)

    // readDirFilter.forEach((ele: any) => {
    //     const filePath = path.join(filterSavedPath, ele)
    //     if (!fs.statSync(filePath).isDirectory()) return
    // })
    if (!existFilter) return false
    return true
}

export default ipcMain










    
        // let numberOfChart: any = {}
        // parseFilterData.filters.forEach(async (filter: any) => {
        //     if (filter.filter_type === "Conclusion") return;
        //     const filterBaseName = `${filter?.filter_type.toLowerCase()}${filter?.chart_type ?? ""}` // example ==> lineHue | lineVal
        //     if (!numberOfChart?.[filterBaseName]) numberOfChart[filterBaseName] = 1
        //     else numberOfChart[filterBaseName]++
        //     const fileData: any = {
        //         savePath: path.join("C:\\scpc\\saves", filterName),
        //         filter,
        //         folderName: "forProgram",
        //         filterBaseName,
        //         numberOfChart: numberOfChart[filterBaseName] < 10 ? `0${numberOfChart[filterBaseName]}` : numberOfChart[filterBaseName]
        //     }
        //     if (filter.filter_type === "SCATTER" && scatterPointLocation && Object.keys(scatterPointLocation?.[filter.id]?? {}).length) fileData.scatterPointLocation = scatterPointLocation?.[filter.id];
        //     await filterType[filter.filter_type as "LINE"](fileData)
        //     numberOfChart = {}
        // })