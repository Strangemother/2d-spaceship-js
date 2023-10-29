

class Bullet {
    constructor(x, y, direction, el) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.velocity = 3; // Adjust as needed
        this.element = el
        // console.log('Bullet', x,y)
        this.t = undefined
    }

    updatePosition(t) {
        // console.log('tick')
        if(this.t == undefined) {
            this.t = t
        }

        if(t - this.t > 200) {
            this.kill()
        }

        let vhp = this.direction * (Math.PI / 180)
        let travel = false;
        
        let x = this.x
        if(travel) {
            x += Math.sin(vhp) * this.velocity;
        }
        
        let y = this.y 
        if(travel) {
            y -= Math.cos(vhp) * this.velocity;
        }
        
        let xy = gridWrap(
                x,y
            )

        this.x = xy[0]
        this.y = xy[1]

    }

    render(t) {
        // Code to render the bullet on the screen
        this.animateDiv()
    }

    animateDiv() {
        this.element.style.left = `${parseInt(this.x)}px`;
        this.element.style.top = `${parseInt(this.y)}px`;
        this.element.style.transform = `rotate(${this.direction}deg)`;
    }

    kill(){
        // console.log('Kill bullet')
        let bullet = bulletBox.remove(this)
        this.element.parentElement.removeChild(this.element)
    }
}


class Blaster {
    constructor(position, direction) {
        this.position = position; // Relative position to the ship's center { x: 0, y: 0 }
        this.direction = direction; // Direction in which the blaster fires bullets (in degrees)
    }

    fire(shipRotation, shipPosition, shipSize) {
        // Calculate the effective direction of the bullet considering the ship's rotation
        const effectiveDirection = this.direction + shipRotation;

        // Calculate the starting position of the bullet considering the ship's position and the blaster's relative position

        // let bulletX = shipPosition.x + this.position.x;
        // let bulletY = shipPosition.y + this.position.y;
        // bulletX = shipPosition.x + (shipSize.width / 2) + this.position.x;
        // bulletY = shipPosition.y + (shipSize.height / 2) + this.position.y;

        // Rotate the blaster's position based on the ship's rotation
        const rotatedPosition = rotatePoint(this.position, shipRotation);

        // Calculate the starting position of the bullet considering the ship's position,
        // the rotated blaster's position, and the ship's size
        const bulletX = shipPosition.x + shipSize.width / 2 + rotatedPosition.x;
        const bulletY = shipPosition.y + shipSize.height / 2 + rotatedPosition.y;

        return bulletBox.create(bulletX, bulletY, effectiveDirection)
    }
}


class BulletBox {
    constructor() {
        this.bullets = [];
    }

    remove(bullet) {
        let bc = this.bullets.length
        this.bullets = this.bullets.filter(item => item !== bullet)
        let ba = this.bullets.length
        // console.log('Bullet removal count:', bc - ba)
    }

    create(x,y, direction) {
        let el = document.createElement('div')
        el.classList.add('bullet')
        document.body.appendChild(el)

        const bullet = new Bullet(x,y, direction, el);
        this.bullets.push(bullet);
        return bullet
    }

    updateBullets(t) {
        for (let bullet of this.bullets) {
            bullet.updatePosition(t);
            bullet.render(t);
        }
    }
}


function rotatePoint(point, angle) {
    const radianAngle = angle * (Math.PI / 180);
    const cosAngle = Math.cos(radianAngle);
    const sinAngle = Math.sin(radianAngle);
    const offsetY = 5
    const offsetX = 5
    return {
        x: (point.x * cosAngle - point.y * sinAngle) + offsetX,
        y: (point.x * sinAngle + point.y * cosAngle) + offsetY
    };
}


const bulletBox = new BulletBox()


class BlasterShip extends MotionShip {
    // ... existing code ...

    constructor(element) {
        super(element);
        // ... existing code ...
        this.bullets = [];
        // Example: Blaster positioned above the ship's center and fires upwards
        this.blasters = [
            // new Blaster({ x: -30, y: 0 }, 0),
            new Blaster({ x: 50, y: 50 }, 45),
            new Blaster({ x: -50, y: -50 }, 0),
            // new Blaster({ x: 30, y: 0 }, 90),
            // new Blaster({ x: 30, y: 0 }, 180),
        ]

    }

    fireBullet() {
        // console.log('Pew!')
        const shipSize = {
            width: this.element.offsetWidth,
            height: this.element.offsetHeight
        };
        for(let blaster of this.blasters) {
            const bullet = blaster.fire(this.rotationAngle, { x: this.x, y: this.y }, shipSize);
            this.bullets.push(bullet);
        }
        // bulletBox.create(this.x, this.y, this.rotationAngle)
        // this.blaster.fire(this.rotationAngle, {x: this.x, y: this.y}, shipSize)
        // bulletBox.create(this.x, this.y, this.rotationAngle)
    }

    tickChange(t) {
        super.tickChange(t)
        bulletBox.updateBullets(t)
    }
    // ... existing code ...
}

// Override the existing global ship.
Ship = BlasterShip

let bulletFiringInterval;

document.addEventListener('keydown', (e) => {
    // ... existing code ...
    if (e.code === 'Space') { // Assuming 'Space' is the fire button
        // bulletFiringInterval = setInterval(() => {
            ship.fireBullet();
        // }, 100); // Adjust the interval as needed
    }
});

document.addEventListener('keyup', (e) => {
    // ... existing code ...
    if (e.code === 'Space') {
        console.log('!unPew.')
        clearInterval(bulletFiringInterval);
    }
});

