class Ship {
    constructor(element) {
        this.element = element;
        this.velocityX = 0;
        this.velocityY = 0;
        this.rotation = 0;
        this.rotationAngle = 0;
        this.power = 0;
        this.pulse = 0;
        this._tick = 0;
        this.els = {}

        this.x = this.element.offsetLeft + this.velocityX;
        this.y = this.element.offsetTop + this.velocityY;

    }

    tickChange() {
        this.rotationAngle += this.rotation

        let rot = this.rotationAngle;
        let speed = this.power;

        // this.velocityX += Math.sin(this.rotationAngle * (Math.PI / 180)) * this.power;
        // this.velocityY -= Math.cos(this.rotationAngle * (Math.PI / 180)) * this.power;
        this.velocityX += Math.sin( rot * ( Math.PI / 180 ) ) * speed;
        this.velocityY -= Math.cos( rot * ( Math.PI / 180 ) ) * speed;


        let x = this.x + this.velocityX;
        let y = this.y + this.velocityY;

        // Wrap around logic
        const spaceSize = 600; // Assuming space is 500x500
        if (x > spaceSize) x = 0;
        if (x < 0) x = spaceSize;
        if (y > spaceSize) y = 0;
        if (y < 0) y = spaceSize;

        this.x = x
        this.y = y
    }

    animateDiv() {
        this.element.style.left = `${parseInt(this.x)}px`;
        this.element.style.top = `${parseInt(this.y)}px`;
        this.element.style.transform = `rotate(${this.rotationAngle}deg)`;
    }

    rotate(direction) {
        this.rotation += direction;
    }

    updateView(){
        this.setText('power', this.power)
        this.setText('tick', this._tick)
        this.setText('rotation', this.rotationAngle)
    }

    setText(name, value) {
        this.getEl(name).textContent = value
    }

    getEl(id) {
        let n = this.els[id]
        if(n == undefined) {
            n = document.getElementById(id);
            this.els[id] = n
        }
        return n
    }

    tick() {
        this.tickChange(this._tick);
        this.animateDiv();

        if(this._tick % 10 == 0) {
            this.updateView()
        }
        this._tick += 1;
    }
}

const shipElement = document.getElementById('ship');
const ship = new Ship(shipElement);

// Animation loop
function animate() {
    ship.tick();
    requestAnimationFrame(animate);
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            ship.power += .01; // Adjust power as needed
            break;
        case 'ArrowDown':
            ship.power -= .01; // Adjust power as needed
            break;
        case 'ArrowLeft':
            ship.rotate(-.03); // Adjust rotation angle as needed
            break;
        case 'ArrowRight':
            ship.rotate(.03); // Adjust rotation angle as needed
            break;
    }
});

document.addEventListener('keyup', (e) => {
    if (
        e.key == 'ArrowUp'
        || e.key == 'ArrowDown'
        ) {
        ship.power = 0;
    }
});

// Start the animation loop
animate();
