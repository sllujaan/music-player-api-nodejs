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

 const path = require('path')


const CURRENT_DIR = path.join(__dirname, '..');
const PATH = CURRENT_DIR.replace(/\\/gi, '/');
const assets = PATH + '/assets/';
const COMPRESSED_IMAGES_PATH = assets + '/images/compressed/';
const MANIFESTS_PATH = assets + '/manifests/';
const TEMP_CONVERT_PATH_FFMPEG = assets + '/TEMP-ffmpeg/';
const DIR_URL = assets+'music/';
const TEMP_DIR_URL = assets+'tempMusic/';
const FILE_EXTENSIONS_REGEX = /.mp3|wma/gi;

//console.log(DIR_URL);
module.exports = {DIR_URL, FILE_EXTENSIONS_REGEX, COMPRESSED_IMAGES_PATH, MANIFESTS_PATH, TEMP_CONVERT_PATH_FFMPEG, TEMP_DIR_URL}
