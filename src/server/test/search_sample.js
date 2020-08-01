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

const list = [{"musicName":"Alan Walker-The Spectre - Copy.mp3","musicPath":"/Alan Walker-The Spectre - Copy.mp3","title":"Spectre","artist":"","album":"Walker","year":"2020","genre":"(17)","imageUrl":"cover/Alan Walker-The Spectre - Copy.mp3.jpg"},
{"musicName":"on_my_way.mp3","musicPath":"/on_my_way.mp3","imageUrl":"cover/on_my_way.mp3.jpg"},
{"musicName":"Alan Walker-The Spectre.mp3","musicPath":"/Alan Walker-The Spectre.mp3","title":"Spectre","artist":"","album":"Walker","year":"2020","genre":"(17)","imageUrl":"cover/Alan Walker-The Spectre.mp3.jpg"},
{"musicName":"Alan Walker-The Spectre.mp3","musicPath":"/Walker/Alan Walker-The Spectre.mp3","title":"Spectre","artist":"","album":"Walker","year":"2020","genre":"(17)","imageUrl":"cover/Walker/Alan Walker-The Spectre.mp3.jpg"},
{"musicName":"Bekhayali.mp3","musicPath":"/Bekhayali.mp3","imageUrl":"cover/Bekhayali.mp3.jpg"}]


const validateArray = (arr) => {
    if(arr && Array.isArray(arr) && arr.length > 0) return true;
    else return false;
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
        if(!validateArray(arrToSearch)) reject('arrToSearch must be an array.')
        
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



searchList(list, ['17'])
.then(data => {
    console.log(data)
})
.catch(err => {
    console.log(err)
})








/* 
var UNIQUE_SEARCH_STR = ''

    //generate regular expression-----
    arr.forEach(el => {
        UNIQUE_SEARCH_STR = UNIQUE_SEARCH_STR +" "+ el
    })
 */



const search = () => {
    var searchArr = []
    var count = 0

    try{
        const names = name.replace(" ", "|")
        const regex = new RegExp(names, 'gi')

        MUSICS_LIST.forEach(({musicName, title}, index) => {
            const searchStr = musicName+" "+title
            console.log(searchStr, regex)
            const arr = searchStr.match(regex)
            
            if(arr) {
                console.log("ture")
                searchArr.push(MUSICS_LIST[index])
            }

            count++
            if(count === MUSICS_LIST.length) {
                if(searchArr.length > 0) return res.status(200).json(searchArr)
                else return res.status(404).end("No search maches.")
            }
        })
        
        return res.status(500).end(`Internal server Error::list was empty.`)
        
    }
    catch(err) {
        console.log(err)
        return res.status(500).end(`Internal server Error::No list exists`)
    }


}

//------------------------------------------------------------------------------------------------------------------------------------------


