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

'use strict'
const list = require('./list')
const { _file } = require('../business/files/file')
const { COMPRESSED_IMAGES_PATH } = require('../business/assets')

class DATA {

    constructor() {}

    isListReady() {
        return list.isListReady()
    }

    getList() {return list._getList()}

    readImage(name) {
        
        return new Promise((resolve, reject) => {
            console.log(COMPRESSED_IMAGES_PATH + '/cover/'+name)
            _file.getImageCover(COMPRESSED_IMAGES_PATH, '/cover/'+name)
            .then(data => {
                resolve(data)
            })
            .catch(err => {
                _file.getImageCover(COMPRESSED_IMAGES_PATH, 'cover/default.jpg')
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject('no such file')
                })
            })
        })
    }

    searchList = (_list, arrToSearch) => {return list.searchList(_list, arrToSearch)}

    
}

const _data = new DATA()

module.exports = { _data, DATA }