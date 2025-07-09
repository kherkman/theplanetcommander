// world/planet.js
export function createPlanet() {
    const radius = 10;
    const detail = 64; // Segments in the sphere. More detail = smoother, but more performance cost.
    
    const geometry = new THREE.SphereGeometry(radius, detail, detail);
    const material = new THREE.MeshPhongMaterial({ vertexColors: true }); // Use vertex colors for the heatmap

    // --- Procedural Terrain Generation ---
    const noise = new SimplexNoise();
    const positions = geometry.attributes.position;
    const colors = [];

    const colorSnow = new THREE.Color(0xffffff);
    const colorGrass = new THREE.Color(0x4a853a);
    const colorSand = new THREE.Color(0xd2b48c);
    const colorTemp = new THREE.Color();

    for (let i = 0; i < positions.count; i++) {
        const vertex = new THREE.Vector3().fromBufferAttribute(positions, i);

        // Generate noise based on the vertex position
        // Multiple layers (octaves) of noise create more interesting terrain
        let displacement = 0;
        const noiseFrequency1 = 1.5;
        const noiseAmplitude1 = 0.8;
        const noiseFrequency2 = 5.0;
        const noiseAmplitude2 = 0.2;

        displacement += noise.noise3D(
            vertex.x * noiseFrequency1, 
            vertex.y * noiseFrequency1, 
            vertex.z * noiseFrequency1
        ) * noiseAmplitude1;
        
        displacement += noise.noise3D(
            vertex.x * noiseFrequency2, 
            vertex.y * noiseFrequency2, 
            vertex.z * noiseFrequency2
        ) * noiseAmplitude2;

        // Apply displacement
        const newPosition = vertex.clone().normalize().multiplyScalar(radius + displacement);
        positions.setXYZ(i, newPosition.x, newPosition.y, newPosition.z);

        // --- Heatmap Coloring ---
        if (displacement > 0.6) { // High places -> Snow
            colorTemp.copy(colorSnow);
        } else if (displacement > 0.1) { // Middle -> Grass
            // Smoothly transition from sand to grass
            const t = (displacement - 0.1) / (0.6 - 0.1);
            colorTemp.copy(colorSand).lerp(colorGrass, t);
        } else { // Low places -> Sand
            colorTemp.copy(colorSand);
        }
        colors.push(colorTemp.r, colorTemp.g, colorTemp.b);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals(); // Recalculate normals for correct lighting on the bumpy surface

    const planetMesh = new THREE.Mesh(geometry, material);

    // --- Water Surface ---
    const waterLevel = radius + 0.1; // Set water level just above the lowest "sand" parts
    const waterGeometry = new THREE.SphereGeometry(waterLevel, detail, detail);
    const waterMaterial = new THREE.MeshPhongMaterial({
        color: 0x006994,
        transparent: true,
        opacity: 0.7
    });
    const waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);

    // Helper function to find a point on the planet's surface
    // This is useful for placing objects correctly.
    function getSurfacePosition(position) {
        const direction = position.clone().normalize();
        const raycaster = new THREE.Raycaster(
            direction.clone().multiplyScalar(radius * 2), // Start from outside
            direction.clone().multiplyScalar(-1)          // Raycast towards the center
        );
        const intersects = raycaster.intersectObject(planetMesh);
        if (intersects.length > 0) {
            return intersects[0].point;
        }
        return position; // Fallback
    }

    return {
        planetMesh,
        waterMesh,
        radius,
        getSurfacePosition
    };
}