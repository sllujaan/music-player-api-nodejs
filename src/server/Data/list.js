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
const list = require('../apps/routes/list')

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
        var tempList = []
        IS_LIST_READY = false
        //reading the directory and getting files names
        const _list = await _file.readDir(DIR_URL); //returns an array
        if(_list && _list.length === 0) return
        //reading tag for each file
        _list.forEach(async (name) => {
            const tag = await _file.readTag(DIR_URL, name)
            if(tag && Object.keys(tag).length > 0) tempList.push(tag)
        });
        //now assign temporaray list to global list
        IS_LIST_READY = true
        LIST = tempList
    }
    catch(err) {
        IS_LIST_READY = false
        LIST =  []
        console.log("ERROR::", err)
    }
}


initList()
console.log('list initiated')

module.exports = {_getList, IS_LIST_READY, isListReady}