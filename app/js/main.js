require({
    // baseUrl: 'js',
    // // three.js should have UMD support soon, but it currently does not
    // shim: { 'vendor/three': { exports: 'THREE' } }
}, [
    'vendor/three'
], function (THREE) {

    var scene, camera, renderer;
    var geometry, material, mesh;
    var tokenBB, ballBB;

    init();
    animate();

    function init() {

        ballCF = new THREE.Matrix4();
        ballTrans = new THREE.Vector3();
        ballScale = new THREE.Vector3();
        ballRot = new THREE.Quaternion();

        tmpRotation = new THREE.Quaternion();
        tmpTranslation = new THREE.Vector3();
        tmpScale = new THREE.Vector3();

        window.addEventListener('keydown', onKeypress, false);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000 );
        const eyePos = new THREE.Vector3 (1000, 300, 400);
        const cameraPose = new THREE.Matrix4().lookAt (
            eyePos,
            new THREE.Vector3 (0, 0, 200),
            new THREE.Vector3 (0, 0, 1));

        cameraPose.setPosition(eyePos);

        camera.matrixAutoUpdate = false;    // disable matrix auto update
        camera.matrixWorld.copy (cameraPose);

        const globalAxes = new Axis();
        scene.add(globalAxes);

        ball = new Ball();
        ballCF.multiply(new THREE.Matrix4().makeTranslation(0, 0, 80));
        scene.add(ball);

        //Token Object
        token = new Token();
        innerRing = new TokenRing(300, 310, 'Blue');
        middleRing = new TokenRing(400, 410, 'Red');
        outerRing = new TokenRing(500, 510, 'Green');

        middleRing.add(innerRing);
        outerRing.add(middleRing);
        token.add(outerRing);
        token.scale.set(0.25, 0.25, 0.25);
        token.translateZ(140);
        token.translateY(500);
        tokenBB = new THREE.Box3().setFromObject(token);
        scene.add(token);

        const lightOne = new THREE.DirectionalLight (0xFFFFFF, 1.2);
        lightOne.position.set (200, 40, 400);
        scene.add (lightOne);

        ground = new Ground();
        scene.add(ground);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

    }

    function animate() {

        requestAnimationFrame(animate);
        ballBB = new THREE.Box3().setFromObject(ball);

        var collision = ballBB.intersectsBox(tokenBB);
        if(collision){
            console.log("Hit");
            scene.remove(token);
        }

        ballCF.decompose (tmpTranslation, tmpRotation, tmpScale);
        ball.position.copy (tmpTranslation);
        ball.quaternion.copy (tmpRotation);
        ball.scale.copy (tmpScale);

        token.rotation.x += 0.01;
        token.rotation.y += 0.02;

        innerRing.rotation.x += 0.007;
        innerRing.rotation.y += 0.008;

        middleRing.rotation.x += 0.009;
        middleRing.rotation.y += 0.01;

        outerRing.rotation.x += 0.01;
        outerRing.rotation.y += 0.02;

        renderer.render(scene, camera);

    }

    const moveYpos = new THREE.Matrix4().makeTranslation (0, 50, 0);
    const moveYneg = new THREE.Matrix4().makeTranslation (0, -50, 0);
    const rotZpos = new THREE.Matrix4().makeRotationZ (THREE.Math.degToRad(5));
    const rotZneg = new THREE.Matrix4().makeRotationZ (THREE.Math.degToRad(-5));
    function onKeypress(event) {
        const key = event.keyCode || event.charCode;

        switch (key){
            case 73: { /* i */
                ballCF.multiply(moveYpos);            /* travel distance: 50, wheel radius 158 */
                break;
            }
            case 74:  /* j */
                ballCF.multiply(rotZpos);
                break;
            case 75:  /* k */
                ballCF.multiply(moveYneg);                /* travel distance: 50, wheel radius 158 */
                break;
            case 76:  /* j */
                ballCF.multiply(rotZneg);
                break;
        }
    }

});
