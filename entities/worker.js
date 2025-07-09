// entities/worker.js
export function createWorker() {
    // A capsule is a good shape for a person/robot
    const geometry = new THREE.CapsuleGeometry(0.2, 0.5, 4, 8); 
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // Bright red
    const worker = new THREE.Mesh(geometry, material);
    return worker;
}