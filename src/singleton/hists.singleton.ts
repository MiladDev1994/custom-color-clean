
import { WriteFiltersFile } from "../handler/utils/WriteFiltersFile";
let histsInstance: any;


class SingletonHistsClass {
    hists: any = {};
    constructor() {
        if (histsInstance) {
          throw new Error("You can only create one instance!");
        }
        histsInstance = this;
    }
    
    get() {
        return this.hists;
    }

    async set(newHists: any) {
        this.hists = newHists;
        // await WriteFiltersFile()
        return newHists;
    }

    reset() {
        this.hists = {}
    }

}

const HISTS = new SingletonHistsClass()

export default HISTS