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


const { exec, fork } = require('child_process')
const fs = require('fs')
const { MANIFESTS_PATH } = require('../business/assets')
// exec('dir', (err, stdout, stderr) => {
//     if(err) throw err;

//     console.log(`stdout: `, stdout);
//     console.log(`stderr: `, stderr);
// })


class Audio {
    constructor() {}
    
    convertFiles(filesPath, quality, ouputPath) { return convert(filesPath, quality, ouputPath) }

    gererateManifest(input, output) { return getMediaManifest(input, output); }

    isManifestExists(name) { return isManifest(name); }
}




const convert = (filePath, quality, ouputPath) => {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i "${filePath}" -map 0:a:0 -b:a ${quality} "${ouputPath}.mp4"`
        console.log(command)
        exec(command, (err, stdout, stderr) => {
            if(err) reject(err);
            if(stdout) resolve(stdout)
            resolve(stderr)
        })
    })
}


const getMediaManifest = (inputPath, ouputPath) => {
    return new Promise((resolve, reject) => {
        const command = `packager in="${inputPath}",stream=audio,output="${ouputPath}.mp4" --mpd_output ${ouputPath}.mpd --min_buffer_time 3 --segment_duration 3"`
        console.log(command)
        exec(command, (err, stdout, stderr) => {
            if(err) reject(err);
            if(stdout) resolve(stdout)
            resolve(stderr)
        })
    })
}


const isManifest = async (name) => {
    return new Promise((resolve, reject) => {
        fs.exists( MANIFESTS_PATH + name, (exists) => {
            if(exists) resolve(true);
            reject(false);
        })
    })
}



const _audio = new Audio()

module.exports = {_audio}