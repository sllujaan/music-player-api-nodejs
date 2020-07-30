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
const { _file } = require('../business/files/file')
const { DIR_URL } = require('../business/assets')

var LIST = [1, 2, 3]
var IS_LIST_READY = true

const _getList = () => {
    if(IS_LIST_READY) return LIST
    else return []
}

const isListReady = () =>{
    return IS_LIST_READY
}

const initList = async () => {
    try{
        IS_LIST_READY = false
        const _list = await _file.readDir(DIR_URL);
        
        IS_LIST_READY = true
        //console.log(_list)
        LIST = _list
    }
    catch(err) {
        LIST =  []
        console.log("ERROR::", err)
    }
}


initList()
console.log('list initiated')

module.exports = {_getList, IS_LIST_READY, isListReady}