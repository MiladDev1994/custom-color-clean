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
        size_type, chart_type, influenceTop, influenceDown,
        savePath, isChanged } = newValue
        // if(!Object.keys(this.value).length) 
        this.value = { app_name, healthy, not_healthy, product_type, app_type, removeBlueBack, savePath, isChanged }
        this.tempFilterValue = {filter_name, filter_type, size_type, chart_type, influenceTop, influenceDown }
        return this.value 
    }
    setTempValue(value: any) {
        this.tempFilterValue = value
        return value
    }

    reset() {
        this.value = {}
        this.tempFilterValue = {}
    }

    getAppData() {
        return this.value
    }

    getTempValue() {
        return this.tempFilterValue
    }

    setSavePath(path: string) {
        const newValue = {
            ...this.value,
            savePath: path,
            isChanged: false,
        };

        this.value = newValue;
        return newValue;
    }

    setIsChanged() {
        const newValue = {
            ...this.value,
            isChanged: true,
        };
        this.value = newValue;
        return newValue;
    }
    
}

const APP_DATA = new AppDataSingleton()

export default APP_DATA;
