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

const nodeID3 = require('node-id3')

var getTag = async (musicName) => {
    return new Promise((resolve, reject) => {
        
        if(!musicName) reject(`[ERROR_getTag]::musicName is required.`)

        nodeID3.read(DIR_URL+musicName, (err, tag) => {  
            if(err) {
                //if(err.errno === -4058) return res.status(404).end("No Files Found.")
                //return res.status(500).end("Internal Server Error.")
                //return reject(`\n[ERROR_getTag]::${err.message}\n`)
                //return reject(`[ERROR_getTag]::` + err.message)
                //return resolve({ERROR: "NO_TAG_FOUND"})
                console.log(err.message)
                return resolve({ERROR: "TAG_ERROR"})

            }
    
            if(tag) {
                //console.log(tag)
                //return res.status(200).end(JSON.stringify(tag))
                const {title, year} = tag
                
                const name = path.basename(musicName)

                return resolve({musicName: name, musicPath: musicName, title: title, year: year, imageUrl: `cover/${musicName}`})
            }
            //return res.status(500).end("Internal Server Error.")
            //return reject(`\n[ERROR_getTag]::No tag found.\n`)
            //return reject(`[ERROR_getTag]::No tag found.`)
            console.log({ERROR: `NO_TAG_FOUND ${musicName}`})
            return resolve({ERROR: "NO_TAG_FOUND"})
        })


    })
    
}




const path = require('path')

//--------------------------------------------------------------------------------------------------------------------
var getTagSample = async (rootPath, musicName) => {
    return new Promise((resolve, reject) => {
        nodeID3.read(rootPath+"/"+musicName, (err, tag) => {  
            if(err) reject(err)
            if(tag) {
                const {title, artist, album, year, genre} = tag
                const name = path.basename(musicName)
                resolve({musicName: name, musicPath: musicName, title: title, artist:artist, album:album, year: year, genre:genre, imageUrl: `cover/${musicName}`})
            }
            return resolve({})
        })
    })
}




var base = "C:/Users/Subhan/OneDrive/HTML_CSS_JAVASCRIPT/__gitProjects__/music-player-api-nodejs/src/server/assets/music/"
const name = "walker/Alan Walker-The Spectre.mp3"

const getTags = async (base, name) => {
    try{
        const tag = await getTagSample(base, name)
        if(Object.keys(tag).length > 0) console.log(tag)
    }
    catch(err) {
        console.log("ERROR::", err)
    }
}

getTags(base, name)