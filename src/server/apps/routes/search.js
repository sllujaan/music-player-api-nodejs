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

const express = require('express');
const list = express();
const { _supplier } = require('../../business/api/supplier')

list.get('/:name', (req, res) => {
    
    const name = req.params.name
    //1. check if list ready or not
    if(!_supplier.isListReady()) return res.status(503).end("server busy! try later.")

    _supplier.searchList(_supplier.getList(), name.split(' '))
    .then(arr => {
        if(Array.isArray(arr)) return res.status(200).send(arr)
    })
    .catch(err => {
        console.log(err)
        return res.status(500).end('server error!')
    })
    
})

module.exports = list