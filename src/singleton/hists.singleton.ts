
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

    set(newHists: any) {
        this.hists = newHists;
        return newHists;
    }

}

const HISTS = new SingletonHistsClass()

export default HISTS