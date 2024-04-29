


import { js2xml } from "xml-js";
const toXmlOption =  { 
    compact: true,
    ignoreComment: true,
    ignoreDeclaration: false,
    spaces: 4
}

export async function Json2Xml(data: any) {
    try {
        return js2xml(data as any, toXmlOption)
    } catch (error) {
        return false
    }
}