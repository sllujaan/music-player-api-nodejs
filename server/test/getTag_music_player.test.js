
var music_player = require('../music_player.js')



test('getTag function successfully retrieves the tag data', () => {
    const expected_data = {
        musicName: 'Alan Walker-The Spectre.mp3',
        title: 'Spectre',
        year: '2020',
        imageUrl: 'cover/Alan Walker-The Spectre.mp3'
      }
    return expect(music_player.getTag("Alan Walker-The Spectre.mp3")).resolves.toEqual(expected_data)
})


test('getTag function fails to retrieve the tag data if musicName is missed.', () => {
    return expect(music_player.getTag()).rejects.toBe(`[ERROR_getTag]::musicName is required.`)
})

test('getTag function fails to retrieve the tag data if no file exists.', () => {
    return expect(music_player.getTag('0-adklfjjiowerkweroiwjlkfdjlkjhhhhhhhhhhhhhhhhh')).rejects.toMatch(/\[ERROR_getTag\]::ENOENT: no such file or directory/i)
})

test('getTag function fails to retrieve the tag data if there is no tag in the existed file', () => {
    return expect(music_player.getTag('zz.txt')).rejects.toBe(`[ERROR_getTag]::No tag found.`)
})