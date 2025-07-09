// entities/rock.js
export function createRock() {
    // TODO: Create a 3D rock model. An Icosahedron with random vertex displacement works well.
    const geometry = new THREE.IcosahedronGeometry(0.5, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const rock = new THREE.Mesh(geometry, material);
    return rock;
}