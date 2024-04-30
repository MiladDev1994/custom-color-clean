 import fs from "fs"
 import fspromises from "fs/promises"
import { js2xml } from "xml-js";
import { prepareFilterForGettingResult } from "../utils/preparersAndConverters";
import { capitalizeFirstLetter } from "../utils/strUtilities";
const toXmlOption =  { 
    compact: true,
    ignoreComment: true,
    ignoreDeclaration: false,
    spaces: 4
}
 
 
 
 
 // برای بخش مربوط به save file
 const prepareAttr = (attr: any, key: any) => { 
    let res: any = {};
    switch (key) {
      case "sorterType":
      case "filterType":
      case "name":      
        res.key = key;
        res.value = `\"${capitalizeFirstLetter(attr)}\"`;
        break;
      case "type":
        res.key = "filterType",
        res.value = `\"${attr}\"`;
        break
      case "isActive":
      case "IsActive":
        res.key = "active";
        res.value = attr ? 1 : 0
        break;
      case "IsGoodSelected":
      case "IsTopSelected":
        res.key = key;
        res.value = attr ? 1 : 0
        break;
      case "iconName":
        res.key = "imgPath";
        res.value = `\"${attr}.svg\"`
        break;
      case "force": 
        res.key = key;
        res.value = `\"${attr.join(",")}\"`
        break;
      // case "family": 
      default:
        res.key = key,
        res.value = attr
        break;
    }
    return res;
  }

// برای بخش مربوط به save file
const prepareStoringCofigForSave = (configs: any, xmlFilters: any) => {
let pc: any = {
    "_instruction": { "xml": { "_attributes": { "version": "1.0" } } },
        opencv_storage: {}
    };
    Object.keys(configs.configs).forEach(key => {
        let attr: any = prepareAttr(configs.configs[key], key);
        if(attr?.key) pc.opencv_storage[attr.key] = attr.value;
    });
    let objFilters: any = {}
    xmlFilters.forEach((item: any, index: any) => {
        objFilters[`filter_${index}`]= item;
    });
    pc.opencv_storage = {
        ...pc.opencv_storage,
        templateName: configs.configs.programName,
        attribute_0: {
            name: "\"Total\"",
            active: 1,
            first_count: 0,
            imgPath: "\"Total.svg\""
        },
        attribute_1: {
            name: "\"OK\"",
            active: 1,
            first_count: 0,
            imgPath: "\"OK.svg\""
        },
        // attribute_2: {
        //     name: "\"Trash\"",
        //     active: 1,
        //     first_count: 0,
        //     imgPath: "\"Trash.svg\"",
        //     hidden: 1,
        //     hardParam: 0
        // },
        attribute_2: {
            name: "\"Unknown\"",
            active: 1,
            first_count: 0,
            imgPath: "\"Unknown.svg\"",
            hidden: 1,
            hardParam: 0
        },
        filterCount: xmlFilters.length,
        ...objFilters
    }

    return js2xml(pc, toXmlOption);

}

  // برای بخش مربوط به save file
const prepareFilterForSave = (filter: any, isActive: any) => {
    let pf: any = {
        "_instruction": { "xml": { "_attributes": { "version": "1.0" } } },
        opencv_storage: {}
    }
    switch (filter.type) {
        case "deep":
        case "size":
            Object.keys(filter.configs).forEach(key => {
                let attr: any = prepareAttr(filter.configs[key], key);
                if(attr?.key) pf.opencv_storage[attr.key] = attr.value;
            });
            pf.opencv_storage.active = isActive ? 1 : 0;
            Object.keys(filter.attributes).forEach(key => {
                let attr = filter.attributes[key];
                let pAttr: any = {};
                Object.keys(attr).forEach(
                    paramKey => {
                    let param: any = prepareAttr(attr[paramKey], paramKey);
                    if(param.key) pAttr[param.key] = param.value;
                });
                pAttr.first_count = 0;
                pf.opencv_storage[key] = pAttr;
            });
            return js2xml(pf as any, toXmlOption);
        case "line":
        let tempLine = prepareFilterForGettingResult(filter);

        Object.entries(tempLine).forEach(([key,value]: any) => {
            let attr: any = value[0];
            let pAttr: any = {};
            pAttr.active = isActive ? 1 : 0;
            pAttr.filterType = `\"${filter.type}\"`;
            pAttr.chartKey = `\"${filter.chartKey}\"`;
            Object.keys(attr).forEach(paramKey => {
            let param: any = prepareAttr(attr[paramKey], paramKey);
                if(param.key) pAttr[param.key] = param.value;
            })
            pf.opencv_storage = pAttr;
        })
        return js2xml(pf as any, toXmlOption);
        // case "scatter":
        // break;
        default:
        break;    
    }
}

// برای بخش مربوط به save file
const prepareSaveFilesToDirectory = async (directoryPath: any, filters: any, config: any) => {
    return new Promise(async (resolve,reject) => {
        // directoryPath = path.join(
        //   directoryPath, `customProgramDir_${Date.now()}`);
        fs.mkdirSync(directoryPath,{recursive: true});
        let fileNames = fs.readdirSync(directoryPath);
        for (const f of fileNames) {
            const stats = fs.statSync(`${directoryPath}/${f}`);
            if (stats.isDirectory()) continue;
            if (f.endsWith("_sorchin_custom.xml")) {
                try {
                    fs.unlinkSync(`${directoryPath}/${f}`);
                } catch (error) {
                // Loggers.error(error);
                    console.error(error);
                }
            }
        };
        const successProcess: any = []
        let xmlFilters: any = [];
        let indexes: any = {
            deep: 1, size: 1,
            lineHue: 1, lineSat: 1, lineVal: 1,
            lineR: 1, lineG: 1, lineB: 1,
            scatterHue: 1, scatterSat: 1, scatterVal: 1,
            scatterR: 1, scatterG: 1, scatterB: 1 
        }
        successProcess[0] = Array.from(Array(filters.length),() => false)
        let xml: any;
        filters.forEach(async (filter: any, index: any) => {
            let fileName: any;
            switch (filter.type) {
                case "deep":
                case "size":
                fileName = `${filter.type}${
                    String(indexes[filter.type]++).padStart(2, '0')}_sorchin_custom.xml`;
                    xml = prepareFilterForSave(filter, filter.isActive);
                break;
                case "line":
                // case "scatter":
                    if(!filter.chartKey) break;
                    fileName = `${filter.type}${filter.chartKey}${String(
                    indexes[`${filter.type}${filter.chartKey}`]++).padStart(2, '0')}_sorchin_custom.xml`;
                    xml = prepareFilterForSave(filter, filter.isActive);
                break;
                default:
                break;
            }
            if(fileName) {
                let xmlFilter = {
                    name: filter.name,
                    active: filter.isActive ? 1 : 0,
                    path: `\"./${fileName}\"` , 
                }
                xmlFilters.push(xmlFilter);
                await fspromises.writeFile(`${directoryPath}/${fileName}`,xml).then(() => successProcess[0][index] = true).catch((error) => reject(error));
            }
        });
        const productName = config.configs.sorterType.toLowerCase()
        const directoryOfProduct = productName === "peanuts" ? "peanut" : productName === "sunflowerseed" ? "sfs" : productName
        xml = prepareStoringCofigForSave(config, xmlFilters);
        await fspromises.writeFile(`${directoryPath}/sortingConfig.xml`,xml).then(
            () => successProcess[1] = true).catch((error) => reject(error));
        await fspromises.copyFile(
            `./assets/${directoryOfProduct}/sortingConfig.json`,
        `${directoryPath}/sortingConfig.json`).then(() => successProcess[2] = true).catch((error) => reject(error));
            resolve(successProcess.flat(Infinity).every((item: any) => item));
    })
};


export {
    prepareSaveFilesToDirectory,
}