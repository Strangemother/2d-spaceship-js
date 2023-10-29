
// Animation loop
function animate() {
    ship.tick();
    requestAnimationFrame(animate);
}


// Start the animation loop
animate();
