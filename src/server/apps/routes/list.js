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
const { _validator } = require('../../validator/validator')
const { _function } = require('../../business/logic/functions')

list.get('/:page?', (req, res) => {
    //check whether the list is ready or not.
    if(!_supplier.isListReady()) return res.status(503).end("server busy! try later.")
    //validate page number from parameter.
    if(!_validator.validateNumber(req.params.page, 1)) return res.status(400).end("invalid parameters!")
    //send page to user if parameter provided.
    if(req.params.page) return res.status(200).send( _function.getSubArray(req.params.page, 10, _supplier.getList()) )
    //Now send the list to user.
    res.send(_supplier.getList())
})

module.exports = list


