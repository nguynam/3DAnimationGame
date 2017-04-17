/**
 * Created by Josh on 4/17/17.
 */

class Strut {
    constructor() {
        let mesh, middle, material;
        middle = new THREE.CylinderGeometry(15, 15, 200, 10);
        material = new THREE.MeshPhongMaterial ({ map: THREE.ImageUtils.loadTexture('textures/crate.jpg') });
        mesh = new THREE.Mesh(middle, material);
        return mesh;
    }
}
