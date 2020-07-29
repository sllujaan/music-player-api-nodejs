/**
 *
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fs = require('fs')
const path = require('path')

walkSync = async (dir, filelist, ROOT_DIR) => {
    try {
        //replace backward slashes \\ to forward / slash
        const files = fs.readdirSync(dir)
        filelist = filelist || [];

        files.forEach( async (file) => {
            //check if directory read is recrusively.
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                filelist = await walkSync(dir + "/" + file, filelist, ROOT_DIR);
            }
            else {
                const isValidFile = await validateFile(file, /.mp3|wma/gi)
                if(!isValidFile) return

                const rootPath = dir + "/" + file
                const regEx = new RegExp(ROOT_DIR, 'gi');
                const newPath = rootPath.replace(regEx, "");
                filelist.push(newPath)
            }
        })
        //return array containing files and subfiles.
        return filelist
    }
    catch(err) {
        throw new Error(err)
    }
}


    var validateFile = async (fileName, extensionsRegEx) => {
        var res = fileName.match(extensionsRegEx)
        if(!res) return false
        else return true
    }

    //const DIR_ROOT = `C:/Users/Subhan/Desktop/new`


/**
     * List all files in a directory in Node.js recursively in a synchronous fashion
     * @param {string} dir 
     * @param {Not used} filelist
     * @returns {Array} return an Array of files
     * 
     * 
     */
readDir = async (dirUrl) =>  {
    dirUrl = dirUrl.replace(/\\/gi, '/')
    const ROOT_DIR = dirUrl
    //walker sync funtion returns all file in directory
    return await walkSync(dirUrl, null, dirUrl)
}




async function init() {
    
    try {
        const dir = `C:/Users\\Subhan/Desktop\\new`

        const arr = await readDir(dir)

        console.log("arr = ", arr)
        console.log('end')
    }
    catch(err) {
        console.log("ERROR::::", err.message)
    }


}

init()


























































/*

//walker sync funtion returns all file in directory
walkSyncSample = async function(dir, filelist) {
    try {
        //replace backward slashes \\ to forward / slash
        dir = dir.replace(/\\/gi, '/')
        const files = fs.readdirSync(dir)
        filelist = filelist || [];

        files.forEach( async (file) => {
            //check if directory read is recrusively.
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                console.log('dir')
                filelist = await walkSyncSample(dir + "/" + file, filelist);
            }
            else {
                console.log('push')
                const isValidFile = await validateFile(file, /.mp3|wma/gi)
                if(!isValidFile) return
    
                const rootPath = dir + "/" + file
                const regEx = new RegExp(DIR_ROOT, 'gi')
                const newPath = rootPath.replace(regEx, "")
                filelist.push(newPath)
            }
        })
        //return array containing files and subfiles.
        return filelist
    }
    catch(err) {
        throw new Error(err)
    }
}
*/