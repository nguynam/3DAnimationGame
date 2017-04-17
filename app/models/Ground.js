/**
 * Created by NamNguyen on 4/13/17.
 */
class Ground{
    constructor(){
        const grass = new THREE.TextureLoader().load("textures/floor.jpg");
        grass.repeat.set(6,6);
        grass.wrapS = THREE.RepeatWrapping;
        grass.wrapT = THREE.RepeatWrapping;
        const ground = new THREE.Mesh (
            new THREE.PlaneGeometry(3500, 3500, 10, 10),
            new THREE.MeshPhongMaterial({ map: grass })
        );
        return ground;
    }
}
