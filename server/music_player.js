var express = require('express')
var app = express()
var fs = require('fs')
var cors = require('cors')
var path = require('path');
const nodeID3 =  require('node-id3')
var http = require('http');
const playLists = require('./playLists')

var CURRENT_DIR = __dirname
const PATH = CURRENT_DIR.replace(/\\/gi, '/')

console.log(PATH)

var assets = PATH + '/assets/'
const DIR_URL = assets+'music/'
const FILE_EXTENSIONS_REGEX = /.mp3|wma/gi

app.use(cors())

var MUSICS_LIST = null
var MUSICS_LIST_READY = false


app.get('/search/:name', (req, res) => {

    if(!MUSICS_LIST_READY) return res.status(503).end("server busy! try later.")

    //var MUSICS_LIST = MUSICS_LIST   //for testing pruposes
    //MUSICS_LIST = null
    
    const name = req.params.name
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

})



app.get('/list/:page?', async (req, res) => {
    
    if(!MUSICS_LIST_READY) return res.status(503).end("server busy! try later.")

    const page = req.params.page
    const MAX_LIST = 1

    if(page && isNaN(parseInt(page))) return res.status(404).end("ERROR::Invalid Pag Number.")

    if(page) {
        const subArr = getSubArray(page, MAX_LIST, MUSICS_LIST)
        return res.json(subArr)
    }

    return res.status(200).json(MUSICS_LIST)

})



app.get('/cover/:name*', async (req, res) => {
    const musicName = req.params.name + req.params[0]
    
    try{
        const tag = await getImageBuffer(musicName)
        
        if(tag && Buffer.isBuffer(tag.imageBuffer)) {
            //console.log(imageBuffer)
            res.writeHead(200, {'content-type': 'image/jpeg'})
            res.write(tag.imageBuffer,'binary');
            res.end(null, 'binary');
        }
        else {
            res.status(404).json({status: 'not-found'})
        }

        
    }
    catch(err) {
        console.log(err)
        return res.status(500).end(`Internal Server Error::${err.message}`)
    }

})





app.get('/', (req, res) => {
    setTimeout(() => {
        res.json({name:"hello"})
    }, 2000);
})

app.get('/albums', (req, res) => {
    const albums = playLists.getAlbums(MUSICS_LIST)
    console.log(albums)
    res.json(albums)
})



app.get('/testjson', (req, res) => {
    res.json({name:"johnson"})
})



app.get('/musics/list', (req, res) => {
    
    //console.log(__dirname)
    fs.readdir(assets+'music', async (err, files) => {

        const dir = assets+'music'
        
        if(err) {
            console.log(err)
            return res.status(500).end("Internal Server Error.")
        }
        
        if(files && files.length > 0) {
            //console.log(files)
            var FilesList = await walkSync(dir)
            console.log(FilesList)

            return res.json(FilesList)
        }
        
        return res.status(404).end("No Files Found.")
    })
})

app.get('/audio/list/:page?', (req, res) => {

    const page = req.params.page
    const MAX_LIST = 1
    console.log(page)

    if(!page) return res.status(404).end("Invalid request 1.")
    if(isNaN(parseInt(page))) return res.status(404).end("Invalid request 2.")
    
    //console.log(__dirname)
    fs.readdir(assets+'music', async (err, files) => {

        const dir = assets+'music'
        
        if(err) {
            console.log(err)
            return res.status(500).end("Internal Server Error.")
        }
        
        if(files && files.length > 0) {
            //console.log(files)
            var FilesList = await walkSync(dir)
            console.log(FilesList)

            const subArr = getSubArray(page, MAX_LIST, FilesList)

            return res.json(subArr)
        }
        
        return res.status(404).end("No Files Found.")
    })
})



app.get('/download', (req, res) => {
    var files = fs.createReadStream("server/sample.txt");
    console.log(files)
    var fileName = files.path
    console.log(fileName)
    var regex = /server\//gi
    fileName = fileName.replace(regex, '')
    console.log(fileName)
    res.writeHead(200, {'Content-disposition': 'attachment; filename='+fileName}); //here you can add more headers
    files.pipe(res)

})


app.get('/music/tag/:name*', (req, res) => {
    //var fileUrl = assets+'music/' + req.params.name
    const fileUrl = `${assets}music/` + req.params.name + req.params[0]
    console.log(req.params.name)
    console.log(fileUrl)
    var ok = false
    if(ok) console.log(ok)
    console.log("false Failed")
   
    nodeID3.read(fileUrl, (err, tag) => {  
        if(err) {
            if(err.errno === -4058) return res.status(404).end("No Files Found.")
            return res.status(500).end("Internal Server Error.")
        }

        if(tag) {
            console.log(tag)
            return res.status(200).end(JSON.stringify(tag))
        }
        return res.status(500).end("Internal Server Error.")
    })
})


app.get('/music/:name*', (req, res) => {
    //var fileUrl = `${assets}music/` + req.params.name
    
    const fileUrl = `${assets}music/` + req.params.name + req.params[0]
    
    console.log(fileUrl)
    var file = fs.createReadStream(fileUrl)

    file.on('error', (err) => {
        if(err.errno === -4058) return res.status(404).end("No Files Found.")
        return res.status(500).end("Internal Server Error.")
    })

    file.on('open', () => {
        var fileName = file.path
        var regex = /server\//gi
        fileName = fileName.replace(regex, '')

        //res.writeHead(200, {'Content-disposition': 'attachment; filename='+fileName}); //here you can add more headers
        return res.status(200).json({name: "song"})
        //return file.pipe(res)
    })
})




app.get('/audio/:name*', (req, res) => {

    const fileUrl = `${assets}music/` + req.params.name + req.params[0]

    var readStream = fs.createReadStream(fileUrl)

    readStream.on('error', (err) => {
        if(err.errno === -4058) return res.status(404).end("No Files Found.")
        return res.status(500).end("Internal Server Error.")
    })

    readStream.on('open', () => {
        var stat = fs.statSync(fileUrl)
        res.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        })

        readStream.pipe(res)

    })

})


app.get('/file/:name*', (req, res) => {
    res.status(200).end("file")
})


app.get('/test/:dir*', (req, res) => {
    console.log(req.params)
    const fileUrl = req.params.dir + req.params[0]
    
    return res.send({url: fileUrl})
})




// List all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = async function(dir, filelist) {
    
    files = fs.readdirSync(dir);
    filelist = filelist || [];

    files.forEach( async function(file) {

        //throw new Error("[foreach::Error]")
    
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = await walkSync(dir + "/" + file, filelist);
        }
        else {

            try{
                const isMusicFile = await validateFile(file, /.mp3|wma/gi)

                if(!isMusicFile) return

                const rootPath = dir + "/" +file
                const regEx = new RegExp(DIR_URL, 'gi')
                const newPath = rootPath.replace(regEx, "")

                filelist.push(newPath)
            }
            catch(err) {
                console.log("err ============== ", err)
                //throw Error("validate Error...")
            }

            
        }
    })

    return filelist;
    
}


var getSubArray = (page, maxFiles, arr) => {
    const endIndex = (page * maxFiles)
    const startIndex = (endIndex - maxFiles)
    const subArr = arr.slice(startIndex, endIndex)
    return subArr
}


var validateFile = async (fileName, extensionsRegEx) => {
    var res = fileName.match(extensionsRegEx)
    if(!res) return false
    else return true
}














 function musics_list_api(httpUrl) {
    return new Promise((resolve, reject) => {
        if(!httpUrl) reject("http url is required.")
        http.get(httpUrl, res => {
            var data = null

            res.on('data', (chunk) => {
                data = chunk.toString()
            })
            res.on('end', () => {
                //console.log(JSON.parse(data))
                console.log(data)
                if(JSON.parse(data)) resolve((JSON.parse(data)))
                else reject("Erro Unknown")
            })
        }).on('error', err => {
            //console.log(err)
            reject(err)
        })

    })
    
}



var prepareMusicsList = () => {

    return new Promise((resolve, reject) => {
        fs.readdir(assets+'music', async (err, files) => {

            const dir = assets+'music'
            
            if(err) {
                if(err.code === 'ENOENT') return reject(`\n[ERROR_prepareMusicsList]::${err.code}\n`)           
            }
            
            if(files && files.length > 0) {
                try{
                    var FilesList = await walkSync(dir)
                }
                catch(err) {
                    console.log(`[ERROR::prepareMusicsList]::`, err)
                }

                return resolve(FilesList)
            }
            
            //return res.status(404).end("No Files Found.")
            return reject("\n[ERROR_prepareMusicsList]::No Files Found.\n")
        })
    })

}


var getImageBuffer = async (musicName) => {
    return new Promise((resolve, reject) => {
        
        if(!musicName) reject(`[ERROR_getTag]::musicName is required.`)

        nodeID3.read(DIR_URL+musicName, (err, tag) => {  
            if(err) {
                //if(err.errno === -4058) return res.status(404).end("No Files Found.")
                //return res.status(500).end("Internal Server Error.")
                //return reject(`\n[ERROR_getTag]::${err.message}\n`)
                return reject(`[ERROR_getTag]::` + err.message)
            }
    
            if(tag) {
                //console.log(tag)
                //return res.status(200).end(JSON.stringify(tag))
                //const {image: {imageBuffer}} = tag
                if(tag.image && tag.image.imageBuffer) return resolve({imageBuffer: tag.image.imageBuffer})
                else return resolve({ERROR: 'NO-IMAGE-FOUND'})
            }
            //return res.status(500).end("Internal Server Error.")
            //return reject(`\n[ERROR_getTag]::No tag found.\n`)
            return reject(`[ERROR_getTag]::No tag found.`)
        })


    })
    
}





var getTag = async (musicName) => {
    return new Promise((resolve, reject) => {
        
        if(!musicName) reject(`[ERROR_getTag]::musicName is required.`)

        nodeID3.read(DIR_URL+musicName, (err, tag) => {  
            if(err) {
                //if(err.errno === -4058) return res.status(404).end("No Files Found.")
                //return res.status(500).end("Internal Server Error.")
                //return reject(`\n[ERROR_getTag]::${err.message}\n`)
                //return reject(`[ERROR_getTag]::` + err.message)
                //return resolve({ERROR: "NO_TAG_FOUND"})
                console.log(err.message)
                return resolve({ERROR: "TAG_ERROR"})

            }
    
            if(tag) {
                //console.log(tag)
                //return res.status(200).end(JSON.stringify(tag))
                const {title, year} = tag
                
                const name = path.basename(musicName)

                return resolve({musicName: name, musicPath: musicName, title: title, year: year, imageUrl: `cover/${musicName}`})
            }
            //return res.status(500).end("Internal Server Error.")
            //return reject(`\n[ERROR_getTag]::No tag found.\n`)
            //return reject(`[ERROR_getTag]::No tag found.`)
            console.log({ERROR: `NO_TAG_FOUND ${musicName}`})
            return resolve({ERROR: "NO_TAG_FOUND"})
        })


    })
    
}


var generateTags = (list) => {

    return new Promise((resolve, reject) => {
        
        if(!list || !Array.isArray(list)) return reject("[ERROR_generateTages]::Array is required.")
        var tags = []
        var count = 0

        list.forEach(async (musicName, index, array) => {
                
            try{
                const tag = await getTag(musicName)
                //const {title, year, image: {imageBuffer}} = tag
                //const imgUrl  .image.imageBuffer.data
                //const imgUrl = await generateImageUrl(imageBuffer)
                const { ERROR } = tag
                if(!ERROR) tags.push(tag)

                //if(index === (array.length-1)) return resolve(tags)
                count++
                if(count === list.length) return resolve(tags)
            }
            catch(err) {
                console.log(err)
                return reject(`\n[ERROR_generateTags]::${err}\n`)
            }

        })

    })
    
}


var prepareTags = async () => {
    
    return new Promise( async (resolve, reject) => {
        
        try{
            const list = await prepareMusicsList()
            console.log(list)
            const tags = await generateTags(list)
            console.log(tags)
            return resolve(tags)
        }
        catch(err) {
            //return res.status(500).end(err)
            return reject(`[ERROR_prepareTags]::${err}`)
        }


    })
    
}







//generating tags after 5 minutes for server efficienty and performance improvemtens----
var initData = async () => {

    MUSICS_LIST_READY = false
    MUSICS_LIST = null

    try{
        //var list = await prepareMusicsList()
        var tags = await prepareTags()
        MUSICS_LIST = tags
        MUSICS_LIST_READY = true
    }
    catch(err) {

        MUSICS_LIST = null
        MUSICS_LIST_READY = false
        console.log('\x1b[33m%s\x1b[0m', `[ERROR_initData]` + err)
    }
}



initData()

setInterval(() => {
    initData()
    console.log(`updated------------------------------------`)
}, 60000);

/* getTag('aa.mp3')
.then(data => {
    console.log(data)
})
.catch(err => {
    console.log(err)
}) */



module.exports = {getTag, prepareMusicsList}





const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log(`listning to http://localhost:${PORT}/`)











  /*
  
  var walkSync = function(dir, filelist) {
    var path = path || require('path');
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);

    filelist = filelist || [];

    files.forEach(function(file) {
        
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        filelist = walkSync(path.join(dir, file), filelist);
      }
      else {
        filelist.push(file);
      }
    });
    return filelist;
  };

  */