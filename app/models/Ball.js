/**
 * Created by NamNguyen on 4/13/17.
 */
class Ball {
    constructor(){
        let mesh, middle, material;
        middle = new THREE.SphereGeometry(100, 200, 200);
        material = new THREE.MeshPhongMaterial ({ map: THREE.ImageUtils.loadTexture('textures/moon.jpg') });
        mesh = new THREE.Mesh(middle, material);
        return mesh;
    }
}
