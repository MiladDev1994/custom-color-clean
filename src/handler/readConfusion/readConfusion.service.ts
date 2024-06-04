
import path from "path"
import fs from "fs"
import colors from "colors"
import {CONFUSION, DECIMAL} from "../../singleton/confusion.singleton";
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import { readImageUtil } from "../utils/readImageUtil";
import { xml2js } from "xml-js";


function walkDirectory(directory: string) {

    const allRecord: any = []
    const filesNumber: any = []

    function walkDir(rootDirectory: string) {
        try {
            const fNamesInRoot = fs.readdirSync(rootDirectory);
            fNamesInRoot.forEach((fNameInRoot: any) => {
                const filePath = path.join(rootDirectory, fNameInRoot);
                
                if (!fs.statSync(filePath).isDirectory()) {
                    if (filePath.includes(".xml") && !filePath.includes("numbers-")) {
                        try {
                          const readXml = fs.readFileSync(filePath, 'utf8');
                          const parser = new XMLParser({
                            ignoreAttributes: false,
                          });
                        //   const id = Number(fNameInRoot.replace("H_Vstd", "").replace("_Mash2D.xml", ""));
                          const id = Number(fNameInRoot.replace("numbers", "").replace(".xml", ""));
                          allRecord.push({
                            id,
                            fileName: filePath.split("\\").pop(),
                            ...parser.parse(readXml)
                          })
                          filesNumber.push(id)
                        } catch (err) {
                        //   console.log(err)
                        }
                      }
                } else {
                    walkDir(filePath)
                } 
            });
            
            if (!allRecord.length) return {status: false, message: "هیچ اطلاعاتی یافت نشد"};
            return {status: true, data: {filesNumber, allRecord}, message: "فهرست خوانده شد"};

        } catch (error) {
            // console.log(error)
            return {status: false, message: "فهرست مورد نظر یافت نشد"}
        }
    }

    const walkResult = walkDir(directory);

    return {
        status: walkResult.status,
        data: walkResult.status ? walkResult.data : {},
        message: walkResult.message
    }
}



async function scanConfusion(directory: string){  
    try {
        const walk: any = walkDirectory(directory);
        if (!walk.status) return {status: false, message: walk.message};
    
        // Directory.set(directory)
        const max = Math.max(...walk.data.filesNumber);
        const findLength = String(max).length - 2 < 2 ? 2 : String(max).length - 2;
        DECIMAL.set(findLength)
        const chartData: any = { e0: [], e1: [], e2: [], e3: [], e4: [], e5: [], e6: [], e7: [], e8: [] };
        
        // const storage = item.opencv_storage
        // const confusion: any = {
        //     e0: (1 - (storage.correctH / storage.totalH)),
        //     e1: (1 - ((storage.totalH - storage.correctH) / storage.totalH)),
        //     e2: (1 - ((storage.totalNH - storage.correctNH) / storage.totalNH)),
        //     e3: (1 - (storage.correctNH / storage.totalNH)),
        //     e4: (1 - (storage.totalH / (storage.totalH + storage.totalNH))),
        //     e5: (1 - (storage.totalNH / (storage.totalH + storage.totalNH))),
        //     e6: (1 - ((storage.totalH - storage.correctH + storage.correctNH) / (storage.totalH + storage.totalNH))),
        //     e7: (1 - ((storage.totalNH + storage.correctH - storage.correctNH) / (storage.totalH + storage.totalNH))),
        //     e8: (1 - ((storage.correctH + storage.correctNH) / (storage.totalH + storage.totalNH)))
        // }

        // for (let key in chartData) {
        //     chartData[key].push({
        //         x: Math.round(item.id * Math.pow(10,findLength)), 
        //         y: 1 - Number(confusion[key])
        //     })
        // }
    
        walk.data.allRecord.map((item: any) => {
            for (let key in chartData) {
                chartData[key].push({
                    x: Math.round(item.id * Math.pow(10,findLength)), 
                    // y: 1 - Number(item?.opencv_storage[key])
                    y: Number(item?.opencv_storage[key])
                })
            }
        })
        const chartLength = max * Math.pow(10, findLength); 
        const data = {
            allRecord: walk.data.allRecord, 
            chartData, 
            chartLength
        }
    
        CONFUSION.set(data)
    
        return {
            status: true, 
            data, 
            message: walk.message
        } 

    } catch (err) {
        return {
            status: false,
            message: "فهرست مورد نظر یافت نشد"
        } 
    }
}



async function readOptimalPoint(address: any) {
    if (fs.existsSync(address)) {
        const readFile = fs.readFileSync(address, "utf8")
        const values = readFile.replace("accuracy: ", "accuracy:").replace("best Area: ", " best_area:").replace("best Delta: ", "best_delta:").split(" ")
        const record: any = {}
        const chartData: any = {}
        values.forEach(ele => {
            const property: any = ele.split(":")
            if (property[0] === "accuracy") record[property[0]] = +(+property[1]).toFixed(2)
            if (property[0] === "best_area") record[property[0]] = Number(property[1])
            if (property[0] === "best_delta") record[property[0]] = Math.pow(10, DECIMAL.get()) * +(property[1])
        })
        chartData.x = Math.pow(10, DECIMAL.get()) * (+values[2].split(":").pop())
        chartData.y = +(+values[0].split(":").pop()).toFixed(2)
        return {record, chartData}
    } else return undefined
    
}


async function readHVImages(address: any) {
    const findImageOnPath = fs.readdirSync(address)
    const mimeType = ["jpg", "jpeg", "png", "bmp"]
    const imagesPaths = findImageOnPath.filter((ele) => ele.split(".").some(item => mimeType.includes(item)))
    const imageData: any = {}
    imagesPaths.forEach((image) => {
        imageData[image.split(".")[0]] = readImageUtil(`${address}\\${image}`)
    })
    return imageData;
}


async function readMash2DH_V(address: any) {
    try {
        const readFile = fs.readFileSync(address, "utf8")
        const options = { compact: true, ignoreDeclaration: false, spaces: 4 };
        let parsXML = xml2js(readFile, options);
        return parsXML
    } catch (error) {
        console.log(colors.red(error))
        return {}
    }
}


export {
    scanConfusion,
    readOptimalPoint,
    readHVImages,
    readMash2DH_V
}





// import path from "path"
// import fs from "fs"
// import {CONFUSION, DECIMAL} from "../../singleton/confusion.singleton";
// import { XMLParser, XMLBuilder } from 'fast-xml-parser'


// function walkDirectory(directory: string) {

//     const allRecord: any = []
//     const filesNumber: any = []

//     function walkDir(rootDirectory: string) {
//         try {
//             const fNamesInRoot = fs.readdirSync(rootDirectory);
//             fNamesInRoot.forEach((fNameInRoot: any) => {
//                 const filePath = path.join(rootDirectory, fNameInRoot);
                
//                 if (!fs.statSync(filePath).isDirectory()) {
//                     if (filePath.includes(".xml") && !filePath.includes("numbers-")) {
//                         try {
//                           const readXml = fs.readFileSync(filePath, 'utf8');
//                           const parser = new XMLParser({
//                             ignoreAttributes: false,
//                           });
//                         //   const id = Number(fNameInRoot.replace("H_Vstd", "").replace("_Mash2D.xml", ""));
//                           const id = Number(fNameInRoot.replace("numbers", "").replace(".xml", ""));
//                           allRecord.push({
//                             id,
//                             fileName: filePath.split("\\").pop(),
//                             ...parser.parse(readXml)
//                           })
//                           filesNumber.push(id)
//                         } catch (err) {
//                         //   console.log(err)
//                         }
//                       }
//                 } else {
//                     walkDir(filePath)
//                 } 
//             });
            
//             if (!allRecord.length) return {status: false, message: "هیچ اطلاعاتی یافت نشد"};
//             return {status: true, data: {filesNumber, allRecord}, message: "فهرست خوانده شد"};

//         } catch (error) {
//             // console.log(error)
//             return {status: false, message: "فهرست مورد نظر یافت نشد"}
//         }
//     }

//     const walkResult = walkDir(directory);

//     return {
//         status: walkResult.status,
//         data: walkResult.status ? walkResult.data : {},
//         message: walkResult.message
//     }
// }



// function scanConfusion(directory: string){  
//     try {
//         const walk: any = walkDirectory(directory);
//         if (!walk.status) return {status: false, message: walk.message};
    
//         // Directory.set(directory)
//         const max = Math.max(...walk.data.filesNumber);
//         const findLength = String(max).length - 2 < 2 ? 2 : String(max).length - 2;
//         DECIMAL.set(findLength)
//         const chartData: any = { e0: [], e1: [], e2: [], e3: [], e4: [], e5: [], e6: [], e7: [], e8: [] };
    
//         walk.data.allRecord.map((item: any) => {
//             for (let key in chartData) {
//                 chartData[key].push({
//                     x: Math.round(item.id * Math.pow(10,findLength)), 
//                     y: 1 - Number(item?.opencv_storage[key])
//                 })
//             }
//         })
//         const chartLength = max * Math.pow(10, findLength); 
//         const data = {
//             allRecord: walk.data.allRecord, 
//             chartData, 
//             chartLength
//         }
    
//         CONFUSION.set(data)
    
//         return {
//             status: true, 
//             data, 
//             message: walk.message
//         } 

//     } catch (err) {
//         return {
//             status: false,
//             message: "فهرست مورد نظر یافت نشد"
//         } 
//     }
// }


// export {
//     scanConfusion
// }