

/**
     * List all files in a directory in Node.js recursively in a synchronous fashion
     * @param {string} dir 
     * @param {Not used} filelist
     * @returns {Array} return an Array of files
     * 
     * 
     */
    walkSync = async function(dir, filelist) {
    
        var files = fs.readdirSync(dir);
        filelist = filelist || [];
    
        files.forEach( async function(file) {
    
            //throw new Error("[foreach::Error]")
        
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                filelist = await walkSync(dir + "/" + file, filelist);
            }
            else {
    
                try{
                    const isMusicFile = await validateFile(file, /.mp3|wma/gi)
    
                    if(!isMusicFile) return
    
                    const rootPath = dir + "/" +file
                    const regEx = new RegExp(DIR_URL, 'gi')
                    const newPath = rootPath.replace(regEx, "")
    
                    filelist.push(newPath)
                }
                catch(err) {
                    console.log("err ============== ", err)
                    //throw Error("validate Error...")
                }
    
                
            }
        })
    
        return filelist;
        
    }



const dir = `C:\Users\Subhan\Desktop\\new`

const arr = walkSync(dir)

console.log(arr)
console.log('end')