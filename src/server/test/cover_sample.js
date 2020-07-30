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
const { COMPRESSED_IMAGES_PATH } = require('../business/assets')



const getImageCover = async (rootpath, name) => {
    return new Promise((resolve, reject) => {
        fs.readFile(rootpath+"/"+name, (err, data) => {
            if(err) reject(err)
            resolve(data)
        })
    })
}


/* try{
    getImageCover(COMPRESSED_IMAGES_PATH, 'cover/on_my_way.mp3.jpg')
}
catch(err) {
    console.log("ERROR::", err)
} */


getImageCover(COMPRESSED_IMAGES_PATH, 'cover/on_my_way.mp3.jpg')
.then(data => {
    //data
    console.log(data)
})
.catch(err => {
    console.log("ERROR::", err)
})
