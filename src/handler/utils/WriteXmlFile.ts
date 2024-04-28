
import fs from "fs";
import createHttpError from "http-errors";
import { js2xml } from "xml-js";

export async function WriteXmlFile(obj: any, address: string) {
    
    const toXmlOption =  { 
        compact: true,
        ignoreComment: true,
        ignoreDeclaration: false,
        spaces: 4
    }
    const objToXml = js2xml(obj as any, toXmlOption)
    try {
        fs.writeFile(address, objToXml, (err) => {
            if (err) throw createHttpError.InternalServerError()
        });
        return objToXml
    } catch (error) {
        return error
    }
}