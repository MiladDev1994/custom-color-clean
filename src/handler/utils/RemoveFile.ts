

import fs from "fs";
import fspromises from 'fs/promises';

export async function RemoveFile(address: string) {
    if(!fs.existsSync(address)) return false
    return fspromises.rm(address, { recursive: true });
}