import fs from "fs"
import colors from "colors"
import createHttpError from "http-errors";
import ENV from "./env";
const { xml2js } = require('xml-js');

let SeedInstance: any


class SeedConfigSingleton {
    seed: any = {};
    constructor() {
        if (SeedInstance) {
          throw new Error("You can only create one instance!");
        }
        SeedInstance = this;
    }
    
    createSorterDefaultConfigs(rootPath: any){
        // return new Promise(async (resolve, reject) => {
          let json: any = {};
          let res: any = {};
          let filters: any = {};
          let result: any = {};
          let sortingConfig = fs.readFileSync(`${rootPath}/sortingConfig.xml`, 'utf8')
          res = xml2js(sortingConfig, { compact: true, spaces: 4 });
          result = { opencv_storage: {} };
         Object.keys(res.opencv_storage).forEach(async key => {
            if (!key.startsWith("filter_")) result.opencv_storage[key] = res.opencv_storage[key];
            else {
              if (res.opencv_storage[key].path._text) {
                let filterData = fs.readFileSync(`${rootPath}/${res.opencv_storage[key].path._text.replace("./", "").replace(/\"/g, "")}`, 'utf8');
                let filter = xml2js(filterData, { compact: true, spaces: 4 })
                
                filter.opencv_storage.name = {}
                filter.opencv_storage.name._text = res.opencv_storage[key].name._text;
                filters[res.opencv_storage[key].name._text.replace(/\"/g, "")] = {
                  opencv_storage: filter.opencv_storage 
                };
              }
            }
          });
          let jsonData = fs.readFileSync(`${rootPath}/sortingConfig.json`, 'utf8');
          try {
            json = JSON.parse(jsonData);
          } catch (error) {
            // Loggers.error(error);
            // console.error(error);
          }
        //   resolve([result,filters,json]);
        // })
    
        return [result,filters,json]
    }

    create() {
        const configPath = ENV.DEFAULT_DATA_SEED_PATH
        try {
            const readDefaultSeedData = fs.readdirSync(configPath)
            readDefaultSeedData?.forEach((item) => {
                const [DefaultSorterConfig, DefaultFilters, Translator] = this.createSorterDefaultConfigs(`${configPath}/${item}`)
                this.seed[item] = {}
                this.seed[item].defaultSorterConfig = DefaultSorterConfig
                this.seed[item].defaultFilters = DefaultFilters
                this.seed[item].translator = Translator
            })
            return this.seed
        } catch(err) {
            console.log(colors.red("can't read defaultDataSeed folder"))
            throw createHttpError.InternalServerError(err)
        }
    }

    get() {
        return this.seed
    }
    
}

const SEED = new SeedConfigSingleton()

export default SEED;
