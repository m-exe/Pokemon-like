const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i=0; i < collisions.length; i+= 70){
    collisionsMap.push(collisions.slice(i, 70 + i));
}

class Boundary {
    static width = 48;
    static height = 48;
    constructor({position}) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    }
    draw(){
        c.fillStyle = 'rgba(255,0,0,0)';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
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


c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);
const image = new Image();
image.src = './img/Pellet Town.png';
image.onload = () => {
    c.drawImage(image, -710, -510);
};

const playerImage = new Image();
playerImage.src = './img/playerDown.png';
class Sprite {
    constructor({position, velocity, image, frames = {max : 1}}) {
        this.position = position;
        this.image = image;
        this.frames = frames;
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        }
    }
    draw(){
        c.drawImage(this.image, 0, 0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width/ this.frames.max,
            this.image.height);
    }
}

const player = new Sprite({
    position:{
        x: canvas.width / 2 - 192 /4 / 2,
        y: canvas.height / 2 - 68 / 2,
    },
    image: playerImage,
    frames: {
        max: 4,
    }
})

const background = new Sprite({
    position:{
    x: offset.x,
    y: offset.y,
    },
    image: image
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

const movables = [background, ...boundaries];
function rectangularCollision({rectangle1, rectangle2}){
    return(rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y);
}
function animate() {
    window.requestAnimationFrame(animate);
    background.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
    player.draw();

    let moving = true;
    if (keys.ArrowUp.pressed && lastKey === 'ArrowUp') {
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
animate();

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