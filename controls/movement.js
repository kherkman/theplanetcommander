// controls/movement.js
export function setupMovement(character, world, camera, clock) {
    const moveState = { forward: 0, right: 0 };
    const moveSpeed = 5; // units per second

    document.addEventListener('keydown', (e) => {
        if (e.key === 'w' || e.key === 'W') moveState.forward = 1;
        if (e.key === 's' || e.key === 'S') moveState.forward = -1;
        if (e.key === 'a' || e.key === 'A') moveState.right = -1;
        if (e.key === 'd' || e.key === 'D') moveState.right = 1;
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') moveState.forward = 0;
        if (e.key === 'a' || e.key === 'A' || e.key === 'd' || e.key === 'D') moveState.right = 0;
    });
    
    // Use the game loop to apply movement
    const animateMovement = () => {
        requestAnimationFrame(animateMovement);
        
        if (moveState.forward === 0 && moveState.right === 0) return;
        
        const deltaTime = clock.getDelta();
        
        // Get camera's forward and right vectors, projected onto the horizontal plane
        const cameraForward = new THREE.Vector3();
        camera.getWorldDirection(cameraForward);
        cameraForward.y = 0; // We only care about the direction in the XZ plane relative to camera
        cameraForward.normalize();
        
        const cameraRight = new THREE.Vector3().crossVectors(camera.up, cameraForward).normalize();

        // Calculate final movement direction
        const moveDirection = new THREE.Vector3()
            .add(cameraForward.multiplyScalar(moveState.forward))
            .add(cameraRight.multiplyScalar(moveState.right))
            .normalize();

        if (moveDirection.length() === 0) return;

        // --- Move character along the sphere's surface ---
        const moveDistance = moveSpeed * deltaTime;
        const currentPos = character.position;
        const planetUp = currentPos.clone().normalize(); // Gravity direction
        
        // The axis of rotation is perpendicular to the up direction and the move direction
        const rotationAxis = new THREE.Vector3().crossVectors(planetUp, moveDirection).normalize();
        
        // The angle to rotate is the distance to travel divided by the planet's radius
        const rotationAngle = moveDistance / world.radius;

        // Apply the rotation to the character's position vector
        currentPos.applyAxisAngle(rotationAxis, rotationAngle);
        
        // Update character height to stick to the terrain
        const newSurfacePoint = world.getSurfacePosition(currentPos);
        character.position.copy(newSurfacePoint);
        
        // Keep character oriented correctly on the surface
        character.up.copy(character.position).normalize();
        character.lookAt(newSurfacePoint.add(moveDirection)); // Make the worker face the direction it's moving
    };
    
    animateMovement();
}