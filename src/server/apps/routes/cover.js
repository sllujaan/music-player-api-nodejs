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
const cover = express();
const { _supplier } = require('../../business/api/supplier')


cover.get('/:name*', (req, res) => {

    const name = req.params.name + req.params[0]
    console.log(name)

    _supplier.getImage(name)
    .then(data => {
        res.writeHead(200, {'Content-Type': 'image/jpeg'})
        res.end(data)
    })
    .catch(err => {
        console.log("ERROR::", err)
        res.status(404).end('not found')
    })

})


module.exports = cover