



const getAlbums = (musicList) => {
    if(!musicList) return
    
    list = [...musicList]
    const albums = list.filter((musicObj, index) => (musicObj.album && (typeof(musicObj.album) == 'string') && (musicObj.album.length > 0)) && list.indexOf(musicObj) === index)
    
    if(!albums) return

    const uniqueSet = Array.from(new Set(albums.map(item => item.album)))
    .map(album => {
        return albums.find(item => item.album === album)
    })
    
    return uniqueSet

}



module.exports = {getAlbums}



/* list = [
    {name:'a', album:'akcent'},
    {name:'a', album:''},
    {name:'a', album:123},
    {name:'a', alb:'jj'},
    {name:'a', album:'Jake'},
    {name:'a', album:'akcent'},
    {name:'a', album:'akcent'}
]

console.log(getAlbums(list)) */
