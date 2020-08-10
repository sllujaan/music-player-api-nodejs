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
const nodeID3 = require('node-id3')
var Jimp = require('jimp');
const { _validator } = require('../../validator/validator')
const { COMPRESSED_IMAGES_PATH } = require('../assets')

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

    /**
     * reads tag of file
     * @param {string} dirUrl
     * @param {string} name 
     */
    readTag = async (dirUrl, name) => {
        try{
            const tag = await getTag(dirUrl, name)
            return tag
            //if(Object.keys(tag).length > 0) console.log(tag)
        }
        catch(err) {
            console.log("ERROR::", err)
        }
    }

    /**
     * 
     * @param {string} buffer 
     * @param {string} savePath 
     */
    compressImage = async (buffer, savePath) => {

        //check if file already exist------
        if(this.isFileExists(savePath)) return;

        //now file does not exist compress it and save.
        Jimp.read(buffer)
        .then(image => {
            // Do stuff with the image.
            image
            .resize(Jimp.AUTO, 200) // resize the height to 250 and scale the width accordingly
            .quality(20)// set JPEG quality
            //.greyscale() // set greyscale
            .write(savePath); // save
            //console.log('image compressed')
        })
        .catch(err => {
            // Handle an exception.
            //console.log("ERROR::", err);
        });
    }


    /**
     * reads image from the server
     * @param {string} rootpath 
     * @param {string} name 
     */
    getImageCover = async (rootpath, name) => {
        return new Promise((resolve, reject) => {
            fs.readFile(rootpath+"/"+name, (err, data) => {
                if(err) reject(err)
                resolve(data)
            })
        })
    }

    /**
     * check for a file wheather exists or not.
     * @param {string} path 
     */
    isFileExists = (path) => {
        if(fs.existsSync(path)) return true;
        return false;
    }

}



/**
 * reads files and subfiles.
 * @param {string} dir
 * @param {string} filelist
 * @param {string} ROOT_DIR
 * 
 */
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


/**
 * return the tag of mp3 file
 * @param {string} rootPath
 * @param {string} musicName
 */
var getTag = async (rootPath, musicName) => {
    return new Promise((resolve, reject) => {
        nodeID3.read(rootPath+"/"+musicName, async (err, tag) => {  
            if(err) reject(err)
            if(tag) {
                const {title, artist, album, year, genre, image} = tag
                const name = path.basename(musicName)
                var coverPath = ``
                //if image compress it and save it for later use
                if(image && image.imageBuffer) {
                    await _file.compressImage(image.imageBuffer, `${COMPRESSED_IMAGES_PATH + "/cover/" + musicName}.jpg`)
                    coverPath = `cover${musicName}.jpg`;
                }else {coverPath = ``};
                
                resolve({musicName: name, musicPath: musicName, title: title, artist:artist, album:album, year: year, genre:genre, imageUrl: coverPath})
            }
            return resolve({})
        })
    })
}


const _file = new FILE()

module.exports = { _file }