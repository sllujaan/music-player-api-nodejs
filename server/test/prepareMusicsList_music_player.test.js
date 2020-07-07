var music_player = require('../music_player.js')


test('prepareMusicsList returns list of musics.', () => {
    return expect(music_player.prepareMusicsList()).resolves.toContain('Alan Walker-The Spectre.mp3')
})