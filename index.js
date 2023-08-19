const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i=0; i < collisions.length; i+= 70){
    collisionsMap.push(collisions.slice(i, 70 + i));
}

const BattleZonesMap = [];
for (let i=0; i < BattleZonesData.length; i+= 70){
    BattleZonesMap.push(BattleZonesData.slice(i, 70 + i));
}

const boundaries = [];
const offset = {
    x: -740,
    y: -630,
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            boundaries.push(new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y,
                    }
                })
            )
    })
});

const BattleZones = [];
BattleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            BattleZones.push(new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y,
                    }
                })
            )
    })
});

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = './img/Pellet Town.png';
image.onload = () => {
    c.drawImage(image, -710, -510);
};

const foregroundImage = new Image();
foregroundImage.src = './img/foregroundObjects.png';
foregroundImage.onload = () => {
    c.drawImage(foregroundImage, -710, -510);
};

const playerDownImage = new Image();
playerDownImage.src = './img/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './img/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './img/playerRight.png';

const player = new Sprite({
    position:{
        x: canvas.width / 2 - 192 /4 / 2,
        y: canvas.height / 2 - 68 / 2,
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10,
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage,
    }
})

const background = new Sprite({
    position:{
    x: offset.x,
    y: offset.y,
    },
    image: image,
});

const foreground = new Sprite({
    position:{
        x: offset.x,
        y: offset.y,
    },
    image: foregroundImage,
});

const keys = {
    ArrowUp: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
}

const movables = [background, ...boundaries, foreground, ...BattleZones];
function rectangularCollision({rectangle1, rectangle2}){
    return(rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y);
}

const battle = {
    initiated: false,
}
function animate() {
    const animationID = window.requestAnimationFrame(animate);
    background.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
    BattleZones.forEach(BattleZones => {
        BattleZones.draw();
    })
    player.draw();
    foreground.draw();

    let moving = true;
    player.animate = false;
    console.log(animationID)
    if (battle.initiated) return

    //activate battle
    if (keys.ArrowUp.pressed || keys.ArrowLeft.pressed || keys.ArrowRight.pressed || keys.ArrowDown.pressed){
        for (let i = 0; i < BattleZones.length; i++) {
            const BattleZone = BattleZones[i];
            const overlappingArea =
               (Math.min(player.position.x + player.width, BattleZone.position.x + BattleZone.width) - Math.max(player.position.x, BattleZone.position.x))
                * (Math.min(player.position.y + player.height, BattleZone.position.y + BattleZone.height) - Math.max(player.position.y, BattleZone.position.y));
            if (rectangularCollision({
                rectangle1: player, rectangle2: BattleZone,}) && overlappingArea > player.width * player.height / 2
            && Math.random() < 0.01)
            {
                console.log('active battle')
                window.cancelAnimationFrame(animationID);
                battle.initiated = true;
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete(){
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete(){
                                animateBattle();
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4,
                                })
                            }
                        })
                    }
                })
                break;
            }
        }
    }

    if (keys.ArrowUp.pressed && lastKey === 'ArrowUp') {
        player.animate = true;
        player.image = player.sprites.up;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player, rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3,
                    }
                }
            })
            ) {
                console.log('colliding');
                moving = false;
                break;
            }
        }

        if (moving)
            movables.forEach(movable => {
                movable.position.y += 3
            });
        } else if (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft') {
        player.animate = true;
        player.image = player.sprites.left;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player, rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y,
                    }
                }
            })
            ) {
                console.log('colliding');
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach(movable => {
                movable.position.x += 3
            });

        } else if (keys.ArrowDown.pressed && lastKey === 'ArrowDown') {
        player.animate = true;
        player.image = player.sprites.down;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player, rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3,
                    }
                }
            })
            ) {
                console.log('colliding');
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach(movable => {
                movable.position.y -= 3
            });

        } else if (keys.ArrowRight.pressed && lastKey === 'ArrowRight') {
        player.animate = true;
        player.image = player.sprites.right;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player, rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y,
                    }
                }
            })
            ) {
                console.log('colliding');
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach((movable) => {
                movable.position.x -= 3
            })
    }
}

//animate();


const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";
const battleBackground = new Sprite({position:{
    x:0,
    y: 0,
    },
    image: battleBackgroundImage,
});



const DraggleImage = new Image();
DraggleImage.src = "./img/draggleSprite.png";
const draggle = new Sprite({
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
})
function animateBattle(){
    window.requestAnimationFrame(animateBattle);
    battleBackground.draw();
    draggle.draw();
}

const EmbyImage = new Image();
EmbyImage.src = "./img/embySprite.png";
const emby = new Sprite({
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
})
function animateBattle(){
    window.requestAnimationFrame(animateBattle);
    battleBackground.draw();
    draggle.draw();
    emby.draw();
}

animateBattle();
document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
        emby.attack({ attack: {
            name: 'Tackle',
            damage: 10,
            type: 'Normal',
            },
            recipient: draggle,
        });
    });
});

let lastKey = '';
window.addEventListener('keydown', (e) => {
    switch (e.key){
        case 'ArrowUp':
            lastKey = 'ArrowUp';
            keys.ArrowUp.pressed = true;
        break;
        case 'ArrowLeft':
            lastKey = 'ArrowLeft';
            keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowDown':
            lastKey = 'ArrowDown';
            keys.ArrowDown.pressed = true;
            break;
        case 'ArrowRight':
            lastKey = 'ArrowRight';
            keys.ArrowRight.pressed = true;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key){
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowDown':
            keys.ArrowDown.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
    }
});