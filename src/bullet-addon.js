

class Bullet {
    constructor(x, y, direction, el) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.velocity = 5; // Adjust as needed
        this.element = el
        console.log('Bullet', x,y)
        this.t = undefined
    }

    updatePosition(t) {
        console.log('tick')
        if(this.t == undefined) {
            this.t = t
        }

        if(t - this.t > 200) {
            this.kill()
        }

        let vhp = this.direction * (Math.PI / 180)
        let x = this.x + Math.sin(vhp) * this.velocity;
        let y = this.y - Math.cos(vhp) * this.velocity;

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
        console.log('Kill bullet')
        let bullet = bulletBox.remove(this)
        this.element.parentElement.removeChild(this.element)
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
        console.log('Bullet removal count:', bc - ba)
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


const bulletBox = new BulletBox()


class ShooterShip extends MotionShip {
    // ... existing code ...

    constructor(element) {
        super(element);
        // ... existing code ...
        this.bullets = [];
    }

    fireBullet() {
        console.log('Pew!')
        bulletBox.create(this.x, this.y, this.rotationAngle)
    }

    tickChange(t) {
        super.tickChange(t)
        bulletBox.updateBullets(t)
    }
    // ... existing code ...
}

// Override the existing global ship.
Ship = ShooterShip

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
