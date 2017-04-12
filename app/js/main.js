require({
    // baseUrl: 'js',
    // // three.js should have UMD support soon, but it currently does not
    // shim: { 'vendor/three': { exports: 'THREE' } }
}, [
    'vendor/three'
], function (THREE) {

    var scene, camera, renderer;
    var geometry, material, mesh;

    init();
    animate();

    function init() {

        window.addEventListener('keydown', onKeypress, false);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 10000 );
        const eyePos = new THREE.Vector3 (1000, 0, 400);
        const cameraPose = new THREE.Matrix4().lookAt (
            eyePos,
            new THREE.Vector3 (0, 0, 10),
            new THREE.Vector3 (0, 0, 1));

        cameraPose.setPosition(eyePos);

        camera.matrixAutoUpdate = false;    // disable matrix auto update
        camera.matrixWorld.copy (cameraPose);

        const globalAxes = new Axis();
        scene.add(globalAxes);

        token = new Token();
        scene.add(token);

        const lightOne = new THREE.DirectionalLight (0xFFFFFF, 1.0);
        lightOne.position.set (100, 40, 50);
        scene.add (lightOne);

        myWheel = new Wheel(5);
        //scene.add( myWheel );

        wheelCF = new THREE.Matrix4();
        wheelTrans = new THREE.Vector3();
        wheelScale = new THREE.Vector3();
        wheelRot = new THREE.Quaternion();

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

    }

    function animate() {

        requestAnimationFrame(animate);

        token.rotation.x += 0.01;
        token.rotation.y += 0.02;

        const rotZ1 = new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(1));

        wheelCF.multiply (rotZ1);
        wheelCF.decompose (wheelTrans, wheelRot, wheelScale);  // decompose the coord frame

        myWheel.position.copy (wheelTrans);   /* apply the transformation */
        myWheel.quaternion.copy(wheelRot);
        myWheel.scale.copy (wheelScale);

        renderer.render(scene, camera);

    }

    function onKeypress(event) {
        const key = event.keyCode || event.charCode;

        switch (key){
            case 73: { /* i */
                frameCF.multiply(moveZpos);
                /* travel distance: 50, wheel radius 158 */
                const angle = 50 / 150;
                wheelCF.multiply (new THREE.Matrix4().makeRotationZ (angle));
                break;
            }
            case 74:  /* j */
                frameCF.multiply(rotYpos);
                break;
            case 75:  /* k */
                frameCF.multiply(moveZneg);
                const angle = 50 / 158;
                wheelCF.multiply (new THREE.Matrix4().makeRotationZ (-angle));
                break;
            case 76:  /* j */
                frameCF.multiply(rotYneg);
                break;
        }
    }

});
