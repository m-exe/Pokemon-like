const EmbyImage = new Image();
EmbyImage.src = "./img/embySprite.png";

const DraggleImage = new Image();
DraggleImage.src = "./img/draggleSprite.png";

const monsters = {
    Emby: {
    position: {
        x:280,
            y:325,
    },
    image: EmbyImage,
        frames: {
    max: 4,
        hold: 18,
},
    animate: true,
        name: 'Emby',
        attacks: [attacks.Tackle, attacks.Fireball],
},
    Draggle: {
        position: {
            x:800,
            y:100,
        },
        image: DraggleImage,
        frames: {
            max: 4,
            hold: 18,
        },
        animate: true,
        isEnemy: true,
        name: 'Draggle',
        attacks: [attacks.Tackle, attacks.Fireball],
    }
}