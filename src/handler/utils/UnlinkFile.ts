

import fs from "fs";

export function UnlinkFile(address: string) {
    let response = false
    if(fs.existsSync(address)) {
        fs.unlink(address, (err) => {
          if (err) response = false
          response = true
        });
    }
    return response
}