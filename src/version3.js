const run = function() {
    const shipElement = document.getElementById('ship');
    window.ship = new Ship(shipElement);

    const engine1 = new Engine(0.00, 0, { x: 50, y: 50 }); // Engine on the right side, pushing to the right
    const engine2 = new Engine(0.00, 0, { x: 50, y: -50 }); // Engine on the left side, pushing to the left
    const engine3 = new Engine(0.00, 0, { x: -50, y: -50 }); // Engine on the left side, pushing to the left
    const engine4 = new Engine(0.00, 0, { x: -50, y: 50 }); // Engine on the left side, pushing to the left

    ship.addEngine(engine1);
    ship.addEngine(engine2);
    ship.addEngine(engine3);
    ship.addEngine(engine4);

    // ... (rest of the code)
}

class Engine {
    constructor(power, direction, position) {
        this.power = power; // Force exerted by the engine
        this.direction = direction; // Direction in which the engine exerts force (in degrees)
        this.position = position; // Position relative to the ship's center { x: 0, y: 0 }
    }

    // Calculate the force exerted by the engine in the X and Y directions
    // getForce() {
    //     return {
    //         x: Math.sin(this.direction * (Math.PI / 180)) * this.power,
    //         y: -Math.cos(this.direction * (Math.PI / 180)) * this.power
    //     };
    // }

    getForce(shipRotation) {
        let r = isNaN(shipRotation)? 0: shipRotation
        const effectiveDirection = this.direction + r;
        const p = this.power// < 0? 0: this.power

        return {
            x: Math.sin(effectiveDirection * (Math.PI / 180)) * p,
            y: -Math.cos(effectiveDirection * (Math.PI / 180)) * p
        };
    }


    // Calculate the torque exerted by the engine
    // getTorque() {
    //     // Torque = Force * Distance (from the center of mass)
    //     // Assuming the ship's center of mass is its center
    //     return this.position.x * this.getForce().y - this.position.y * this.getForce().x;
    // }

    getTorque() {
        // Torque = Force * Distance (from the center of mass)
        // Assuming the ship's center of mass is its center
        // Multiply by a small factor (e.g., 0.01) to control the torque's effect
        return 0.01 * (this.position.x * this.getForce().y - this.position.y * this.getForce().x);
    }

    setDirection(shipRotation) {
        // console.log('setDirection', shipRotation)
        this.direction = shipRotation;
    }

}


class Engines {
    // ... (rest of the class)

    constructor(element) {
        // ... (rest of the constructor)
        this.engines = [];
    }

    addEngine(engine) {
        this.engines.push(engine);
    }

    removeEngine(engine) {
        const index = this.engines.indexOf(engine);
        if (index > -1) {
            this.engines.splice(index, 1);
        }
    }

    // Update the tickChange method to account for the force and torque from each engine
    tickChange() {

        for (let engine of this.engines) {
            const force = engine.getForce(this.rotationAngle);
            const torque = engine.getTorque();

            this.velocityX += force.x;
            this.velocityY += force.y;
            // this.rotationAngle += torque; // Adjust this value as needed
            this.angularVelocity += torque; // This will adjust the ship's angular velocity based on the engines' torque
        }


    }
}


class Ship extends Engines {
    constructor(element) {
        super()
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

        this.angularVelocity = 0;


    }

    tickChange() {
        super.tickChange()

        this.rotationAngle += this.angularVelocity;

        // this.rotationAngle += this.rotation
        let rot = this.rotationAngle % 360;
        // let speed = this.power;
        this.rotationAngle = rot
        // this.setEngineDegrees(rot)
        // this.velocityX += Math.sin( rot * ( Math.PI / 180 ) ) * speed;
        // this.velocityY -= Math.cos( rot * ( Math.PI / 180 ) ) * speed;

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
        // this.setEngineDegrees(isNaN(rot)?0:rot)
    }

    animateDiv() {
        this.element.style.left = `${parseInt(this.x)}px`;
        this.element.style.top = `${parseInt(this.y)}px`;
        this.element.style.transform = `rotate(${this.rotationAngle}deg)`;
    }

    setPower(value) {
        for(let e of this.engines) {e.power = value}
    }

    addPower(change) {
        for(let e of this.engines) { e.power += change }
    }

    addPowerMany(changes) {
        changes = Array.from(arguments)
        for(let e in this.engines) { this.engines[e].power += changes[e] }
    }

    rotate(direction) {
        this.rotation += direction;
        this.setEngineDegrees(this.rotation)
    }


    setEngineDegrees(direction) {

        for (let engine of this.engines) {
            engine.setDirection(direction);
        }
        // for(let e in this.engines) {
        //     this.engines[e].direction = direction
        // }
    }

    tick() {
        this.tickChange(this._tick);
        this.animateDiv();

        if(this._tick % 10 == 0) {
            this.updateView()
        }
        this._tick += 1;
    }

    updateView(){
        this.setText('power', this.power)
        this.setText('tick', this._tick)
        this.setText('rotation', this.rotationAngle)
        this.setText('vx', this.velocityX)
        this.setText('vy', this.velocityY)

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

}


document.addEventListener('keydown', (e) => {
    let rt = .05;
    switch (e.key) {
        case 'ArrowUp':
            ship.addPower(.005); // Adjust power as needed
            break;
        case 'ArrowDown':
            ship.addPower(-.005); // Adjust power as needed
            break;
        case 'ArrowLeft':
            // ship.rotate(-.03); // Adjust rotation angle as needed
            ship.addPowerMany(rt, 0, -rt, 0); // Adjust power as needed
            break;
        case 'ArrowRight':
            // ship.rotate(.03); // Adjust rotation angle as needed
            ship.addPowerMany(0, -rt, 0, rt); // Adjust power as needed
            break;
    }
});

document.addEventListener('keyup', (e) => {
    if (
        e.key == 'ArrowUp'
        || e.key == 'ArrowDown'
        || e.key == 'ArrowLeft'
        || e.key == 'ArrowRight'
        ) {
        // ship.power = 0;
        ship.setPower(0); // Adjust power as needed
    }
});

;run();
