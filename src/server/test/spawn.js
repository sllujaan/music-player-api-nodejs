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
'-i Alan.mp3 -map 0:a:0 -b:a 64k output.mp4'

const { spawn } = require('child_process');
const bat = spawn('ffmpeg', ['-i', 'alan.mp3', '-map', '0:a:0', '-b:a', '64k', 'output.mp4'])

bat.stderr.on('data', (err) => {
    console.log('stderr:: => ', err.toString())
    bat.kill("SIGABRT")
})

bat.stdout.on('data', (data) => {
    console.log('data => ', data.toString())
})

bat.on('message', m => {
    console.log('message => ', m);
})

bat.on('close', (code) => {
    console.log(`child process closed with code ${code}`);
});

bat.on('exit', code => {
    console.log(`child process exited with code ${code}`);
})