
import path from "path"
import fs from "fs"
import {CONFUSION, DECIMAL} from "../../singleton/confusion.singleton";
import { XMLParser, XMLBuilder } from 'fast-xml-parser'


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



function scanConfusion(directory: string){  
    try {
        const walk: any = walkDirectory(directory);
        if (!walk.status) return {status: false, message: walk.message};
    
        // Directory.set(directory)
        const max = Math.max(...walk.data.filesNumber);
        const findLength = String(max).length - 2 < 2 ? 2 : String(max).length - 2;
        DECIMAL.set(findLength)
        const chartData: any = { e0: [], e1: [], e2: [], e3: [], e4: [], e5: [], e6: [], e7: [], e8: [] };
    
        walk.data.allRecord.map((item: any) => {
            for (let key in chartData) {
                chartData[key].push({
                    x: Math.round(item.id * Math.pow(10,findLength)), 
                    y: 1 - Number(item?.opencv_storage[key])
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


export {
    scanConfusion
}