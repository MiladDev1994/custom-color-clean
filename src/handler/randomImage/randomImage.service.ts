import { readImageUtil } from "../utils/readImageUtil";

let id = 0;


export const getSampleImages = async (types: any, result: any, count: any, chartType: any, images?: any) => {
    id = 0
    let healthyImagesPath = [...result?.[chartType]?.[0]?.healthys];
    let nonHealthyImagesPath = [...result?.[chartType]?.[0]?.nonhealthys];
    
    let healthyImages = (images && Object.keys(images).length) ? images.healthy : []
    let nonHealthyImages = (images && Object.keys(images).length)  ? images.nonHealthy : []

    if (healthyImagesPath?.length && types.includes("healthy")) {
        if (healthyImagesPath.length <= count) {
            healthyImages = readImage(healthyImagesPath)
        } else {
            healthyImages = getRandomFromList(count, healthyImagesPath)
        }
    }

    if (nonHealthyImagesPath?.length && types.includes("nonHealthy")) {
        if (nonHealthyImagesPath.length <= count) {
            nonHealthyImages = readImage(nonHealthyImagesPath)
        } else {
            nonHealthyImages = getRandomFromList(count, nonHealthyImagesPath)
        }
    }

    return {
        healthy: healthyImages,
        nonHealthy: nonHealthyImages,
    }

  };

  
const getRandomFromList = (limit: any, list: any) => {
    const imgList = [];
    for (let i = 0; i < limit; i++) {
        id++
        const randomIndex = Math.floor(Math.random() * list.length)
        const imageBase64 = readImageUtil(list[randomIndex])
        imgList.push({
            id,
            path: list[randomIndex],
            image: imageBase64
        });
    }
    return imgList;
};


const readImage = (list: any) => {
    const imgList: any = [];
    list.forEach((image: any) => {
        id++
        const imageBase64 = readImageUtil(image)
        imgList.push({
            id,
            path: image,
            image: imageBase64
        })
    })
    return imgList;
}