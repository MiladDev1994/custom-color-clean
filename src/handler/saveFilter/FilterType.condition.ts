import fs from "fs"
import path from "path"
import colors from "colors"
import fspromises from "fs/promises"
import { js2xml } from "xml-js";
import { prepareFilterForGettingResult } from "../utils/preparersAndConverters";
import { capitalizeFirstLetter } from "../utils/strUtilities";
import APP_DATA from "../../singleton/appData.singleton";
import { WriteXmlFile } from "../utils/WriteXmlFile";
const toXmlOption =  { 
   compact: true,
   // ignoreComment: true,
   ignoreDeclaration: false,
   spaces: 4
}


export async function LINE(data: any) {

    const {
        savePath,
        filter,
        folderName,
        numberOfChart,
        filterBaseName
    } = data;


    try {

        const chartPositionData = filter?.userData?.[filter?.chart_type.toLowerCase()]?.[0]
        let xmlStructure = {
          "_instruction": { "xml": { "_attributes": { "version": "1.0" } } },
          opencv_storage: {
            active: chartPositionData?.isActive ?? 1,
            filterType: `"${filter.filter_type.toLowerCase()}"`,
            chartKey: `"${filter.chart_type}"`,
            p1: {
                x: chartPositionData?.p1?.x ?? 0,
                y: chartPositionData?.p1?.y ?? 0
            },
            p2: {
                x: chartPositionData?.p2?.x ?? 255,
                y: chartPositionData?.p2?.y ?? 0
            },
            isTopSelected: chartPositionData?.isTopSelected ?? true,
            isGoodSelected: APP_DATA.getAppData().app_type ? 1 : 0,
            influence: chartPositionData?.influence ?? 50,
          }
        }
        const xml = js2xml(xmlStructure as any, toXmlOption);
        const fileName = `${filterBaseName}_${numberOfChart}_sorchin_custom.xml`
        await WriteXmlFile(xml, path.join(savePath, folderName, fileName))
        return true
    } catch (error) {
        console.log(colors.red(error))
        return true
    }
}



let counter: number = 0
export async function SCATTER(data: any) {

    const {
        savePath,
        filter,
        folderName,
        numberOfChart,
        filterBaseName,
        scatterPointLocation
    } = data;

    try {

        // let counter = 0;
        // let xmlStructure: any = {
        //     "_instruction": { "xml": { "_attributes": { "version": "1.0" } } },
        // }
        // filter?.allIdealPoints.forEach((point: any) => {
        //     counter++
        //     let delta = point.X ?? 0
        //     let area = point?.areaPointSelectedData?.verticalLines?.[0] ?? 0
        //     const data = {
        //         [`delta${counter}`]: delta,
        //         [`area${counter}`]: area,
        //     }
        //     xmlStructure.opencv_storage = {
        //         ...xmlStructure.opencv_storage,
        //         count: counter,
        //         influenceTop: filter?.influenceTop ?? "0.5",
        //         influenceDown: filter?.influenceDown ?? "0.5",
        //         ...data
        //     };
        // })

        if (!filter?.allIdealPoints?.length) return;
        const newFilter = {...filter}
        const lastIndex = newFilter?.allIdealPoints.length - 1
        let idealPoint = newFilter?.allIdealPoints?.[lastIndex]
        let delta = idealPoint.X ?? 0
        let area = idealPoint?.areaPointSelectedData?.verticalLines?.[0] ?? 0
        if (scatterPointLocation) {
            delta = scatterPointLocation.delta;
            area = scatterPointLocation.area;
        }

        let xmlStructure: any = {
            "_instruction": { "xml": { "_attributes": { "version": "1.0" } } },
        }
        const data = {
            delta,
            area,
            influenceTop: filter?.influenceTop ?? "0.5",
            influenceDown: filter?.influenceDown ?? "0.5"
        }
        xmlStructure.opencv_storage = data;

        const scatterPath = `${filterBaseName}_${numberOfChart}`
        fs.mkdirSync(path.join(savePath, folderName, scatterPath))

        const fileName = `${filterBaseName}_sorchin_custom.xml`
        const SaveStructureXml = js2xml(xmlStructure as any, toXmlOption);
        await WriteXmlFile(SaveStructureXml, path.join(savePath, folderName, scatterPath, fileName))
        
        const Mean2DStructureXml = js2xml(filter.Mean2DH_V ?? {} as any, toXmlOption);
        await WriteXmlFile(Mean2DStructureXml, path.join(savePath, folderName, scatterPath, "Mean2DH_V.xml"))

        // await WriteXmlFile(Mean2DStructureXml, path.join(savePath, folderName, "Mean2DH_V.xml"))
        // const Mash2DH_VPath = "C:\\scpc\\featureAnalyzer\\Hesaab\\Mean2DH_V.xml"
        // if(fs.existsSync(Mash2DH_VPath)) {
        //     fs.copyFileSync(Mash2DH_VPath, path.join(savePath, folderName, "Mean2DH_V.xml"))
        //     if (!fs.existsSync(meanFilePath)) fs.mkdirSync(meanFilePath)
        //     fs.copyFileSync(Mash2DH_VPath, path.join(meanFilePath, `Mean2DH_V.xml`))
        // }
        

        return true
    } catch (error) {
        console.log(colors.red(error))
        return true
    }
}
