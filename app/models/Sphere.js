/**
 * Created by NamNguyen on 4/12/17.
 */
class Sphere {
    constructor(){
        var mesh, geometry, material;
        geometry = new THREE.SphereGeometry(200, 200, 200);
        material = new THREE.MeshPhongMaterial ({ map: THREE.ImageUtils.loadTexture('textures/wood.jpg') });
        mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
}
