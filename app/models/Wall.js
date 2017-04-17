/**
 * Created by Josh on 4/17/17.
 */

class Wall {
    constructor() {
        let mesh, middle, material;
        middle = new THREE.CylinderGeometry(25, 25, 3500, 10);
        material = new THREE.MeshPhongMaterial ({ map: THREE.ImageUtils.loadTexture('textures/wood.jpg') });
        mesh = new THREE.Mesh(middle, material);
        return mesh;
    }
}
