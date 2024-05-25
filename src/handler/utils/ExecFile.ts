import { execFile, execFileSync, spawn } from "child_process";


export async function ExecFile(fileName: string, cwd: string) {
    
    try {
        execFile(fileName, { cwd }, (error, stdout, stderr) => {
        if (error) {
            // console.log("error", error)
            return error
          // Loggers.error(`error: ${error.message}`);
          return;
        }
        if(stdout) {
            // console.log("stdout", stdout)
            return stdout
          // console.log(stdout);
        }
        if (stderr) {
            // console.log("stderr", stderr)
            return stderr
          // Loggers.error(`stderr: ${stderr}`);
        }
        });




        // const bat = spawn(fileName, { cwd, shell: true});

        // bat.stdout.on('data', (res) => {
        //     console.log("data", res.toString())
        // });
        
        // bat.stderr.on('data', (error) => {
        //     console.log("error", error)
        // });
        
        // bat.on('exit', (code) => {
        //     console.log('exit', code)
        // }); 

    } catch (error) {
        return error
    }
}