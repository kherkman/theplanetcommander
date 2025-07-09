// main.js
import { createPlanet } from './world/planet.js';
import { createWorker } from './entities/worker.js';
import { setupMovement } from './controls/movement.js';

// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Camera Controls (OrbitControls for turning and zooming)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Makes the rotation feel smoother
controls.minDistance = 15;     // How close you can zoom in
controls.maxDistance = 100;    // How far you can zoom out

// --- World Generation ---
const world = createPlanet();
scene.add(world.planetMesh);
scene.add(world.waterMesh);

// --- Entity Creation ---
const playerWorker = createWorker();
scene.add(playerWorker);

// Initial placement of the worker on the planet surface
const initialPosition = new THREE.Vector3(0, world.radius + 2, 0); // Start at north pole
playerWorker.position.copy(world.getSurfacePosition(initialPosition));
playerWorker.up = playerWorker.position.clone().normalize(); // Align worker to be "upright" on the sphere

// --- Player Controls (WASD) ---
const clock = new THREE.Clock();
setupMovement(playerWorker, world, camera, clock);

// Set initial camera position
camera.position.z = 30;

// Game Loop
function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    // Update controls for any user input (pan, zoom)
    controls.update();

    // The movement logic is handled by keydown events in movement.js,
    // but you could add continuous updates here if needed.
    
    // Render the scene from the camera's perspective
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the game loop
animate();