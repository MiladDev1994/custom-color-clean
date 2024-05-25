
import fs from "fs";
import createHttpError from "http-errors";
import { js2xml } from "xml-js";

export async function WriteXmlFile(objToXml: any, address: string) {
    try {
        fs.writeFile(address, objToXml, (err) => {
            if (err) console.log(err)
        });
        return objToXml
    } catch (error) {
        console.log(error)
        return error
    }
}