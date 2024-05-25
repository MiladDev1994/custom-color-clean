
// const filters = [
//     {id: 1, name: "milad1"},
//     {id: 2, name: "milad2"},
//     {id: 3, name: "milad3"}
// ]

// const oldFilters = [...filters]
// const findIndex = oldFilters.findIndex(ele => ele.id === 2)
// const spliceFilters = oldFilters.splice(findIndex, 1)
// const newFilter = {
//     ...spliceFilters[0],
//     name: "milad5"
// }
// oldFilters.splice(findIndex, 0, newFilter)
// console.log(oldFilters)

const { XMLParser } = require("fast-xml-parser");
const fs = require("fs")
const path = require("path")
// const path = require("path")
// const address = "C:\\scpc\\featureAnalyzer\\BehIabi\\optimal.txt"

// if (fs.existsSync(address)) {
//     const readFile = fs.readFileSync(address, "utf8")
//     const values = readFile.replace("accuracy: ", "accuracy:").replace("best Area: ", " best_area:").replace("best Delta: ", "best_delta:").split(" ")
//     const record = {}
//     const chartData = {}
//     values.forEach(ele => {
//         const property = ele.split(":")
//         if (property[0] === "accuracy") record[property[0]] = +(property[1])
//         if (property[0] === "best_area") record[property[0]] = Number(property[1])
//         if (property[0] === "best_delta") record[property[0]] = +(property[1])
//     })
//     chartData.x = Math.pow(10, 2) * (+values[2].split(":").pop())
//     chartData.y = +(+values[0].split(":").pop()).toFixed(2)
//     console.log(record)
//     console.log(chartData)
// } else return {}


// accuracy: 0.948413best Area: 0.01 best Delta: 0.45



// console.log(0.948413.toFixed(2))


// const readImagesPath = () => {
//     const filePath = `C:\\scpc\\featureAnalyzer\\Hesaab\\folders.xml`;
//     try {
//       const readFilesPathXML = fs.readFileSync(filePath, "utf8");
//       const parser = new XMLParser({
//         ignoreAttributes: false,
//       });
//       const parsXML = parser.parse(readFilesPathXML)
//       // console.log(parsXML, "parsXML")
//       const healthy = {};
//       const nonHealthy = {};
//       Object.entries(parsXML.opencv_storage).forEach(([key, value]) => {
//           const imagesName = []
//           Object.entries(value).map(([fileKey, fileValue]) => fileKey.includes("im") && imagesName.push(fileValue.replaceAll('"', '').split("/").pop()))
//           const readDir = fs.readdirSync(value.folder.replaceAll('"', ''));
//           const fileHealthy = key.includes("Non") ? nonHealthy : healthy
//           fileHealthy[value.folder] = {isInXml: [], isOutXml: []}
//           if (readDir.length) {
//               readDir.forEach(fileName => {
//                   if (fileName.includes("_image.bmp")) {
//                       const filePath = path.join(value.folder.replaceAll('"', ''), fileName);
//                       const readImage = readImageUtil(filePath)
//                     //   console.log(readImage)
//         //       // console.log(readImage, "readDir")
//         console.log(imagesName, "imagesName")
//         if (imagesName.includes(fileName)) {
//             console.log(fileName, "fileName")
//                 fileHealthy[value.folder]["isInXml"].push(readImage)
//               } else {
//                 fileHealthy[value.folder]["isOutXml"].push(readImage)
//               }
//             }
//           })
//         }
//       })
//       return {healthy, nonHealthy};
//     } catch (_) {
//       return {healthy: {}, nonHealthy: {}};
//     }
//   }


  
//   const filesPath = readImagesPath()

// //   console.log(filesPath)


// function readImageUtil(route){
//     let image = "";
//     try {
//       const readImage = fs.readFileSync(route);
//       image = readImage.toString("base64");
//       return image;
//     } catch (_) {
//       return image;
//     }
// }





// const filters = [
//   {
//     id: 1,
//     userData: {
//       "count": 20,
//       "defaultObjectType": 1,
//       "hue": [
//           {
//               "p1": {
//                   "x": 92,
//                   "y": 26.3720640570653
//               },
//               "p2": {
//                   "x": 131,
//                   "y": 26.3720640570653
//               },
//               "isTopSelected": true,
//               "isGoodSelected": 1,
//               "isActive": true,
//               "influence": 50,
//               "priority": 0
//           }
//       ]
//     }
//   },
//   {
//     id: 2,
//     userData: {
//       "count": 20,
//       "defaultObjectType": 1,
//       "hue": [
//           {
//               "p1": {
//                   "x": 92,
//                   "y": 26.3720640570653
//               },
//               "p2": {
//                   "x": 131,
//                   "y": 26.3720640570653
//               },
//               "isTopSelected": false,
//               "isGoodSelected": 2,
//               "isActive": true,
//               "influence": 55,
//               "priority": 100
//           }
//       ]
//     }
//   },
//   {
//     id: 3,
//     userData: {
//       "count": 20,
//       "defaultObjectType": 1,
//       "b": [
//           {
//               "p1": {
//                   "x": 92,
//                   "y": 26.3720640570653
//               },
//               "p2": {
//                   "x": 131,
//                   "y": 26.3720640570653
//               },
//               "isTopSelected": true,
//               "isGoodSelected": 1,
//               "isActive": true,
//               "influence": 50,
//               "priority": 0
//           }
//       ]
//     }
//   }
// ]


// let json = {}
// filters.forEach(ele => {
//   delete ele.userData.count;
//   delete ele.userData.defaultObjectType;
//   const chartType = Object.keys(ele.userData)
//   if (!Object.keys(json).includes(chartType.join(""))) {
//     json[chartType] = ele.userData[chartType]
//   } else {
//     json[chartType].push(ele.userData[chartType][0])

//   }
// })


// json.count = 20
// json.defaultObjectType = 1

// console.log(json)



// console.log(new Date().getTime())


function readImageUtil(route){
  let image = "";
  try {
    const readImage = fs.readFileSync(route);
    image = readImage.toString("base64");
    return image;
  } catch (_) {
    return image;
  }
}


const addresss = "C:\\scpc\\featureAnalyzer\\BehIabi"
function readHVImages(address) {
  const findImageOnPath = fs.readdirSync(address)
  const mimeType = ["jpg", "jpeg", "png", "bmp"]
  const imagesPaths = findImageOnPath.filter((ele) => ele.split(".").some(item => mimeType.includes(item)))
  console.log(imagesPaths)
  // const imagesPaths = [
  //     `${address}\\H_Vhealthy.jpg`,
  //     `${address}\\H_Vnonhealthy.jpg`,
  //     `${address}\\H_Vover.png`
  // ]
  const imageData = {}
  imagesPaths.forEach((image) => {
      imageData[image.split(".")[0]] = readImageUtil(`${addresss}\\${image}`)
  })
  return imageData;
}

console.log(readHVImages(addresss))

// const mimeType = ["jpg", "jpeg", "png", "bmp"]
// console.log([ 'config', 'ccc' ].some(item => mimeType.includes(item)))