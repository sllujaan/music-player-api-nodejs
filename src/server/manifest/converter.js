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


const { exec } = require('child_process');
const fs = require('fs');
const path = require('path')
const { TEMP_DIR_URL, DIR_URL, MANIFESTS_PATH, TEMP_CONVERT_PATH_FFMPEG } = require('../business/assets');
// exec('dir', (err, stdout, stderr) => {
//     if(err) throw err;

//     console.log(`stdout: `, stdout);
//     console.log(`stderr: `, stderr);
// })


class Audio {
    constructor() {}
    
    convertFile(filePath, quality, ouputPath) { return convert(filePath, quality, ouputPath) }

    gererateManifest(input, output) { return getMediaManifest(input, output); }

    isManifestExists(name) { return isManifest(name); }

    deleteTempDirFiles() {return deleteTempFiles()}

    createDir(path, name) {return createDirectory_async(path, name);}

    _cloneDirsTo_ffmpeg() {return cloneDirectories();}

    _isFile(filePath) {return isFileExists(filePath);}

}




const convert = (filePath, quality, ouputPath) => {
    return new Promise((resolve, reject) => {
        if(!filePath || !quality || !ouputPath) return reject('all parameters are required.')

        //resolving paths--
        filePath = reslovePath(filePath);
        ouputPath = reslovePath(ouputPath);
        //ouputPath = 
        const command = `ffmpeg -i "${filePath}" -map 0:a:0 -b:a ${quality} "${ouputPath}.mp4"`
        //console.log(command)
        exec(command, (err, stdout, stderr) => {
            if(err) return reject(err);
            if(stdout) return resolve(stdout);
            if(stderr) return resolve(stderr);
        })
    })
}


const getMediaManifest = (inputPath, ouputPath) => {
    return new Promise((resolve, reject) => {
        
        inputPath = path.normalize(inputPath);
        ouputPath = path.normalize(ouputPath);

        const command = `packager in="${inputPath}",stream=audio,output="${ouputPath}.mp4" --mpd_output "${ouputPath}.mpd" --min_buffer_time 3 --segment_duration 3"`

        //console.log(command + '\n\n')
        exec(command, (err, stdout, stderr) => {
            if(err) reject(err);
            if(stdout) resolve(stdout)
            resolve(stderr)
        })
    })
}


const isManifest = async (name) => {
    return new Promise((resolve, reject) => {
        console.log(MANIFESTS_PATH + name + '\n')
        fs.exists( MANIFESTS_PATH + name, (exists) => {
            if(exists) resolve(true);
            reject(false);
        })
    })
}

const deleteTempFiles = async () => {
    return new Promise((resolve, reject) => {
        fs.readdir(TEMP_CONVERT_PATH_FFMPEG, (err, files) => {
            if(err) return reject(err);

            for(const file of files) {
                fs.unlink(path.join(TEMP_CONVERT_PATH_FFMPEG, file), err => {
                    reject(err)
                })
            }

            resolve('files deleted successfully.')
        })
    })
    
}

const createDirectory = (fullPath, name) => {
    return new Promise((resolve, reject) => {
        console.log('dir method called =>');
        const pathName = fullPath+"/"+name
        if(!fs.existsSync(pathName)) {
            fs.mkdir(pathName, err => {
                if(err) return reject(`failed to created dir: ${pathName}`)
                console.log('dir created => ', pathName);
                return resolve('created.')
            })
        }

        return resolve('already exists')
    })
    
}

const getAllDirectories = (pathName, directories = null) => {
    
    directories = directories || [];

    fs.readdirSync(pathName, {withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .map(dirent => {
        const dirPath = path.join(pathName, dirent.name);
        handlePushPaths(dirPath, directories);
        getAllDirectories(dirPath, directories);
    });

    return directories;
}

const handlePushPaths = (dirPath, directories) => {
    
    const regex = new RegExp(TEMP_DIR_URL, 'gi');
    const path_F_slash = reslovePath_F_slash(dirPath);
    const removedMusicDir = path_F_slash.replace(regex, "");
    directories.push(removedMusicDir);
}


const cloneDirectories = () => {
    
    return new Promise((resolve, reject) => {
        var FAILD_DIR_CREATIONS = [];
        const dirPaths = getAllDirectories(TEMP_DIR_URL);

        
        dirPaths.forEach(dirName => {
            //console.log( TEMP_CONVERT_PATH_FFMPEG + dirName);
            //console.log(reslovePath(TEMP_CONVERT_PATH_FFMPEG + dirName))
            const dirUrl = reslovePath(TEMP_CONVERT_PATH_FFMPEG + dirName);
            createDirectory_async(dirUrl).catch(err => FAILD_DIR_CREATIONS.push(err));
        })

        if(FAILD_DIR_CREATIONS.length > 0) return reject(FAILD_DIR_CREATIONS);
        return resolve('directories cloned successfully');

    }) 
}


const createDirectory_async = (pathName) => {
    return new Promise((resolve, reject) => {

        //resolving paths--
        pathName = reslovePath(pathName);

        if(!fs.existsSync(pathName)) {

            try{
                fs.mkdirSync(pathName);
                return resolve('created.');
            }
            catch(err) {
                return reject(`failed to create dir: ${pathName}`)
            }
        }

        return resolve('already exists')
    })
}

const reslovePath = (pathName) => {
    const newPath = pathName.replace(/(\/)+/gi, "\\");
    const normalized = path.normalize(newPath);
    return normalized;
}

const reslovePath_F_slash = (pathName) => {
    const newPath = pathName.replace(/(\\)+/gi, "/");
    return newPath;
}

const isFileExists = (filePath) => {
    try{
        if(fs.existsSync(filePath)) return true;
        return false;
    }
    catch(err) {
        console.log("FILE::ERROR => ", err);
        return false;
    }
}


const _audio = new Audio()

module.exports = {_audio}