/**
 * Created by Josh on 4/12/17.
 */

class TokenRing {
    constructor(innerRad, outerRad, color){

        let col = color;
        let file;

        if (col == 'Blue') {
            file = 'textures/blue.jpg';
        } else if (col == 'Red') {
            file = 'textures/red.jpg';
        } else {
            file = 'textures/green.jpg';
        }

        let mesh, middle, material;
        middle = new THREE.RingGeometry(innerRad, outerRad, 50);
        material = new THREE.MeshPhongMaterial ({ map: THREE.ImageUtils.loadTexture(file) });
        mesh = new THREE.Mesh(middle, material);
        mesh.material.side = THREE.DoubleSide;
        return mesh;
    }
}
