
let confusionInstance: any;
let decimalInstance: any;


class SingletonConfusionClass {
    confusion: any = {};
    constructor() {
        if (confusionInstance) {
          throw new Error("You can only create one instance!");
        }
        confusionInstance = this;
    }
    
    get() {
        return this.confusion;
    }

    set(newConfusion: any) {
        this.confusion = newConfusion;
        return newConfusion;
    }

}

class DecimalClass {
    decimal: any = 0;
    constructor () {
        if (decimalInstance) throw new Error("You can only create one instance!")
        decimalInstance = this
    }

    set(data: any) {
        this.decimal = data
        return data
    }

    get() {
        return this.decimal
    }
}

const CONFUSION = new SingletonConfusionClass()
const DECIMAL = new DecimalClass()

export {
    CONFUSION,
    DECIMAL,
};