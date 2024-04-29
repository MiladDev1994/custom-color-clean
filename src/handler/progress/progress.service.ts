
// import path from "path"
// import fs from "fs"
// const featurePath = process.env.ELECTRON_APP__FEATURE_ANALYZER_PATH

// export async function OneDimension(event: any) {
//     if(fs.existsSync(path.join(featurePath, "Progress.txt"))) {
//         fs.readFile(path.join(featurePath, "Progress.txt"), 'utf8', (err, data) => {
//             return event.sender.send("progress_chanel", Number(data))
//         })
//     } else {
//         return event.sender.send("progress_chanel", 0)
//     }
// }


// export async function TwoDimension(event: any) {
//     if(fs.existsSync(path.join(featurePath, "BehIabi", "Progress.txt"))) {
//         fs.readFile(path.join(featurePath, "BehIabi", "Progress.txt"), 'utf8', (err, data) => {
//             return event.sender.send("progress_chanel", Number(data))
//         })
//     } else {
//         return event.sender.send("progress_chanel", 0)
//     }
// }