import fs from 'fs';
import { xml2js } from 'xml-js';
import TemplateModel from "../../DB/models";
const options = {
    compact: true,
    ignoreDeclaration: false,
    spaces: 4,
    commentKey: '_comment' // This option is important to preserve comments
};

export async function getAllPrograms() {
    
    const programs = await TemplateModel.findAll({
        raw: true
    })
    
    programs.map((ele: any) => {
        if (!fs.existsSync(ele.template_path)) return ele.hasProgramFile = false
        const xml = fs.readFileSync(ele.template_path, 'utf8');
        const xmlToJson: any = xml2js(xml, options)
        const {filterPath} = xmlToJson?.opencv_storage
        ele.hasProgramFile = true
        ele.filterPath = filterPath
    })

    return programs;
    
}