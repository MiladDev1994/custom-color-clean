import fs from "fs"
import colors from "colors"
import createHttpError from "http-errors";
const { xml2js } = require('xml-js');

let AppDataInstance: any


class AppDataSingleton {
    value: any = {};
    tempFilterValue: any = {}
    constructor() {
        if (AppDataInstance) {
          throw new Error("You can only create one instance!");
        }
        AppDataInstance = this;
    }
    
    set(newValue: any) {
        
        const { app_name, filter_name, healthy, not_healthy,
        product_type, app_type, removeBlueBack, filter_type,
        size_type, chart_type, influenceTop, influenceDown } = newValue

        if(!Object.keys(this.value).length) this.value = { app_name, healthy, not_healthy, product_type, app_type, removeBlueBack }
        this.tempFilterValue = {filter_name, filter_type, size_type, chart_type, influenceTop, influenceDown }
        return this.value 
    }

    getAppData() {
        return this.value
    }

    getTempValue() {
        return this.tempFilterValue
    }
    
}

const APP_DATA = new AppDataSingleton()

export default APP_DATA;
