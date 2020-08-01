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

class Validator {
    constructor () {}

    /**
     * Validated the given number .
     * @param {number} value 
     * @param {number?} min 
     * @param {number} max 
     */
    validateNumber(value, min, max) {
        if(value && isNaN(parseInt(value))) return false
        if((value < min) || (value > max)) return false
        return true
    }

    validateString() {

    }

    /**
     * validate file from given extension
     * @param {string} fileName 
     * @param {RegEx} extensionsRegEx 
     */
    validateFile = async (fileName, extensionsRegEx) => {
        var res = fileName.match(extensionsRegEx)
        if(!res) return false
        else return true
    }

    /**
     * validates the given array
     * @param {Array} arr 
     */
    validateArray = (arr) => {
        if(arr && Array.isArray(arr) && arr.length > 0) return true;
        else return false;
    }
    
}

const _validator = new Validator()

module.exports = { _validator }