

import fs from "fs";
import fspromises from 'fs/promises';

export async function RemoveFile(address: string) {
    // console.log(address)
    if(!fs.existsSync(address)) return false
    return fspromises.rm(address, { recursive: true });
}