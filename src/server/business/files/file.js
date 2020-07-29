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
const { _validator } = require('../../validator/validator')

class FILE {
    constructor() {}

    /**
     * reads directory files and subfiles.
     * @param {string} dirUrl 
     */
    readDir = async (dirUrl) =>  {
        dirUrl = dirUrl.replace(/\\/gi, '/')
        const ROOT_DIR = dirUrl
        //walker sync funtion returns all file in directory
        return await walkSync(dirUrl, null, dirUrl)
    }
    

}



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
                const isValidFile = await _validator.validateFile(file, /.mp3|wma/gi)
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



const _file = new FILE()

module.exports = { _file }