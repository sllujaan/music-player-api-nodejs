const fs = require('fs');
const path = require('path')
const { DIR_URL, TEMP_CONVERT_PATH_FFMPEG } = require('../business/assets')



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
    
    const regex = new RegExp(DIR_URL, 'gi');
    const path_F_slash = reslovePath_F_slash(dirPath);
    const removedMusicDir = path_F_slash.replace(regex, "");
    directories.push(removedMusicDir);
}


const cloneDirectories = () => {
    
    return new Promise((resolve, reject) => {
        var FAILD_DIR_CREATIONS = [];
        const dirPaths = getAllDirectories(DIR_URL);

        
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




//console.log(getAllDirectories(DIR_URL));

cloneDirectories()
.then(data => {
    console.log(data);
})
.catch(err => {
    console.log(err)
})