const audio = {
    Map: new Howl({
        src: './audio/map.wav',
        html5: true,
        volume: 1,
    }),
    initBattle: new Howl({
        src: './audio/InitBattle.wav',
        html5: true,
        volume: 0.125,
    }),
    battle: new Howl({
        src: './audio/battle.mp3',
        html5: true,
        volume: 0.22,
    }),
    tackleHit: new Howl({
        src: './audio/tackleHit.wav',
        html5: true,
        volume: 0.22,
    }),
    fireballHit: new Howl({
        src: './audio/fireballHit.wav',
        html5: true,
        volume: 0.21,
    }),
    initFireball: new Howl({
        src: './audio/initFireball.wav',
        html5: true,
        volume: 0.4,
    }),
    victory: new Howl({
        src: './audio/victory.wav',
        html5: true,
        volume: 1,
    })
}