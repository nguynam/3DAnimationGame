/**
 * Created by Josh on 4/12/17.
 */

class Token {
    constructor(){
        let mesh, middle, material;
        middle = new THREE.SphereGeometry(200, 200, 200);
        material = new THREE.MeshPhongMaterial ({ map: THREE.ImageUtils.loadTexture('textures/galaxy.jpg') });
        mesh = new THREE.Mesh(middle, material);
        return mesh;
    }
}
