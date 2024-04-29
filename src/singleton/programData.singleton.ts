import fs from "fs"
import colors from "colors"
import createHttpError from "http-errors";
const { xml2js } = require('xml-js');

let ProgramDataInstance: any


class ProgramDataSingleton {
    value: any = {};
    constructor() {
        if (ProgramDataInstance) {
          throw new Error("You can only create one instance!");
        }
        ProgramDataInstance = this;
    }
    
    set(newValue: any) {
        return this.value = newValue
    }

    get() {
        return this.value
    }
    
}

const PROGRAM_DATA = new ProgramDataSingleton()

export default PROGRAM_DATA;
