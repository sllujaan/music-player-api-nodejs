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
const { _validator } = require('../validator/validator')

var LIST = [1, 2, 3]
var IS_LIST_READY = true

const _getList = () => {
    if(IS_LIST_READY) return LIST
    else return []
}

const isListReady = () =>{
    return IS_LIST_READY
}

/**
 * intializes list
 */
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


/**
 * 
 * @param {Array} LIST 
 * @param {Array} arrToSearch
 * @returns {Array} return an array
 */
const searchList = (LIST, arrToSearch) => {
    return new Promise((resolve, reject) => {
        if(!LIST || !Array.isArray(LIST)) reject('list must be an array.')
        if(!_validator.validateArray(arrToSearch)) reject('arrToSearch must be an array.')
        
        const UNIQUE_SEARCH_STR = arrToSearch.join("|").replace(/\s/gi, "|")
        const regex = new RegExp(UNIQUE_SEARCH_STR, 'gi')
        const arrSearchFounds = []
        
        LIST.forEach(({musicName, title, artist, album, year, genre}, index) => {
            const str = `${musicName} ${title} ${artist} ${album} ${year} ${genre}`
            const arr = str.match(regex)
            if(arr && arr.length > 0) arrSearchFounds.push(LIST[index])
        })
        resolve(arrSearchFounds)
    })
}




initList()
console.log('list initiated')

module.exports = {_getList, IS_LIST_READY, isListReady, searchList}