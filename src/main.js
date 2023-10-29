
const run = function() {
    const shipElement = document.getElementById('ship');
    console.log('Running new', Ship.name)
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

;run();
