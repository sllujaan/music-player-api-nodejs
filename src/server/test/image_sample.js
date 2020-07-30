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

var getImageBufferSample = async (musicName) => {
    return new Promise((resolve, reject) => {
        
        if(!musicName) reject(`[ERROR_getTag]::musicName is required.`)

        nodeID3.read(DIR_URL+musicName, (err, tag) => {  
            if(err) {
                //if(err.errno === -4058) return res.status(404).end("No Files Found.")
                //return res.status(500).end("Internal Server Error.")
                //return reject(`\n[ERROR_getTag]::${err.message}\n`)
                return reject(`[ERROR_getTag]::` + err.message)
            }
    
            if(tag) {
                //console.log(tag)
                //return res.status(200).end(JSON.stringify(tag))
                //const {image: {imageBuffer}} = tag
                if(tag.image && tag.image.imageBuffer) return resolve({imageBuffer: tag.image.imageBuffer})
                else return resolve({ERROR: 'NO-IMAGE-FOUND'})
            }
            //return res.status(500).end("Internal Server Error.")
            //return reject(`\n[ERROR_getTag]::No tag found.\n`)
            return reject(`[ERROR_getTag]::No tag found.`)
        })


    })
    
}


const nodeID3 = require('node-id3');
var Jimp = require('jimp');

//------------------------------------------------------------------------------------------------------

//const imageUrl = "C:/Users/Subhan/Desktop/sam/default.png"
const dirUrl = "C:/Users/Subhan/Desktop/sam/"

const compressImage = (buffer, savePath) => {
    Jimp.read(buffer)
    .then(image => {
        // Do stuff with the image.
        image
        .resize(Jimp.AUTO, 200) // resize the height to 250 and scale the width accordingly
        .quality(20) // set JPEG quality
        //.greyscale() // set greyscale
        .write(savePath); // save

        console.log('image compressed')
    })
    .catch(err => {
        // Handle an exception.
        console.log("ERROR::", err);
    });
}


//compressImage(imageUrl)


















const getImageBuffer = async (rootPath, musicName) => {
    return new Promise((resolve, reject) => {
        nodeID3.read(rootPath+"/"+musicName, (err, tag) => {  
            if(err) reject(err)

            if(tag) {
                if(tag.image && tag.image.imageBuffer) resolve({imageBuffer: tag.image.imageBuffer})
                else reject(`00::00 image does not exist on the file [${musicName}]`)
            }
            reject(`image does not exist on the file [${musicName}]`)
        })
    })
}


var base = "C:/Users/Subhan/OneDrive/HTML_CSS_JAVASCRIPT/__gitProjects__/music-player-api-nodejs/src/server/assets/music/"
const name = "walker/Alan Walker-The Spectre.mp3"
//const name = "ab.txt"

const initBuffer = async (dirUrl, name) => {
    try{
        const buff = await getImageBuffer(dirUrl, name)
        console.log(buff)
        compressImage(buff.imageBuffer, (dirUrl+"/compressed.jpg"))
    }
    catch(err) {
        console.log("ERROR::", err)
    }
}

initBuffer(base, name)