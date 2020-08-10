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

import { exec } from 'child_process'

exec('dir', (err, stdout, stderr) => {
    if(err) throw err;

    console.log(`stdout: `, stdout);
    console.log(`stderr: `, stderr);
})


class Audio {
    constructor() {}
    
    convertFiles(filesPath, quality) { return convert(filesPath, quality) }

}

const _audio = new Audio()


const convert = (filePath, quality) => {
    return new Promise((resolve, reject) => {
        exec('ffmpeg -version', (err, stdout, stderr) => {
            if(err) reject(err);
            if(stdout) resolve(stdout)
            reject(stderr)
        })        
    })
}

module.exports = {_audio}