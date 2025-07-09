// entities/plant.js
export function createPlant() {
    // TODO: Create a 3D plant/tree model. A brown cylinder for the trunk and a green cone for the leaves is a simple start.
    const geometry = new THREE.ConeGeometry(0.5, 1, 8);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const plant = new THREE.Mesh(geometry, material);
    return plant;
}