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
    var score = 0;
    var size = 3400;
    var xLoc = 0;
    var yLoc = 0;
    let tempX = 0;
    let tempY = 0;
    let moveX;
    let moveY;
    let totalX = 0;
    let totalY = 0;
    let step = 10;

    var update = true;

    document.getElementById("insert").innerHTML = "";

    init();
    animate();

    function init() {

        ballCF = new THREE.Matrix4();
        ballRingCF = new THREE.Matrix4();
        ballTrans = new THREE.Vector3();
        ballScale = new THREE.Vector3();
        ballRot = new THREE.Quaternion();

        tmpRotation = new THREE.Quaternion();
        tmpTranslation = new THREE.Vector3();
        tmpScale = new THREE.Vector3();

        window.addEventListener('keydown', onKeypress, false);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000 );
        const eyePos = new THREE.Vector3 (0, -3000, 1000); //1000, 300, 400 || 0, 1, 3000
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
        ballRing = new TokenRing(110, 120, 'Blue');
        ballRing2 = new TokenRing(105, 115, 'Red');
        ballRing3 = new TokenRing(95, 105, 'Green');

        ballRingCF.multiply(new THREE.Matrix4().makeTranslation(0,0,90));
        ballRing2.translateZ(20);
        ballRing3.translateZ(40);
        ballRing.add(ball);
        ballRing.add(ballRing2);
        ballRing.add(ballRing3);
        scene.add(ballRing);

        // let bgWall = new Wall();
        // scene.add(bgWall);
        // bgWall.position.x += 1750;

        let fRightStrut = new Strut();
        scene.add(fRightStrut);
        fRightStrut.position.x += 1750;
        fRightStrut.position.z += 100;
        fRightStrut.position.y -= 1750;
        fRightStrut.rotateX(55);

        let fLeftStrut = new Strut();
        scene.add(fLeftStrut);
        fLeftStrut.position.x -= 1750;
        fLeftStrut.position.z += 100;
        fLeftStrut.position.y -= 1750;
        fLeftStrut.rotateX(55);

        let bRightStrut = new Strut();
        scene.add(bRightStrut);
        bRightStrut.position.x += 1750;
        bRightStrut.position.z += 100;
        bRightStrut.position.y += 1750;
        bRightStrut.rotateX(55);

        let bLeftStrut = new Strut();
        scene.add(bLeftStrut);
        bLeftStrut.position.x -= 1750;
        bLeftStrut.position.z += 100;
        bLeftStrut.position.y += 1750;
        bLeftStrut.rotateX(55);

        let rightWall = new Wall();
        scene.add(rightWall);
        rightWall.position.x += 1750;
        rightWall.position.z += 200;

        let leftWall = new Wall();
        scene.add(leftWall);
        leftWall.position.x -= 1750;
        leftWall.position.z += 200;

        let backWall = new Wall();
        scene.add(backWall);
        backWall.translateY(1750);
        backWall.translateZ(200);
        backWall.rotateZ(THREE.Math.degToRad(90));

        let frontWall = new Wall();
        scene.add(frontWall);
        frontWall.translateY(-1750);
        frontWall.translateZ(200);
        frontWall.rotateZ(THREE.Math.degToRad(90));


        //Token Object
        token = new Token();
        innerRing = new TokenRing(290, 310, 'Blue');
        middleRing = new TokenRing(390, 410, 'Red');
        outerRing = new TokenRing(490, 510, 'Green');

        middleRing.add(innerRing);
        outerRing.add(middleRing);
        token.add(outerRing);
        token.scale.set(0.25, 0.25, 0.25);
        token.translateZ(140);
        token.translateY(500);
        //tokenBB = new THREE.Box3().setFromObject(token);
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
        tokenBB = new THREE.Box3().setFromObject(token);

        var collision = ballBB.intersectsBox(tokenBB);
        if(collision){
            scene.remove(token);
            score = 1; //FIX ME: This displays but does not update when the atom is caught
            document.getElementById("insert").innerHTML = "YOU WIN!!!!!!!";
        }

        ballCF.decompose (tmpTranslation, tmpRotation, tmpScale);
        ball.position.copy (tmpTranslation);
        ball.quaternion.copy (tmpRotation);
        ball.scale.copy (tmpScale);

        ballRingCF.decompose(tmpTranslation, tmpRotation, tmpScale);
        ballRing.position.copy(tmpTranslation);
        ballRing.quaternion.copy(tmpRotation);
        ballRing.scale.copy(tmpScale);

        token.rotation.x += 0.01;
        token.rotation.y += 0.02;

        let plusOrMinusX;
        let plusOrMinusY;

        if(update){
            plusOrMinusX = Math.random() < 0.5 ? -1 : 1; //Generates a 1 or -1
            moveX = plusOrMinusX * 700; //This affects the speed it moves around

            plusOrMinusY = Math.random() < 0.5 ? -1 : 1;
            moveY = plusOrMinusY * 700;

            update = false;
        }

        if (tempX > -size && tempX < size) { //makes sure it doesn't go out of bounds
            if(moveX < 0){
                token.position.x -= step;
                totalX -= step;
                xLoc -= step;
                tempX = xLoc -= step;
            }
            else{
                token.position.x += step;
                totalX += step;
                xLoc += step;
                tempX = xLoc += step;
            }

            if(totalX == moveX){
                update = true;
                totalX = 0;
            }
        }
        else{
            if(tempX > 0)
                tempX -= 100;
            else
                tempX += 100;
            moveX *= -1;
        }

        if (tempY > -size && tempY < size) {
            if(moveY < 0){
                token.position.y -= step;
                totalY -= step;
                yLoc -= step;
                tempY = yLoc -= step;
            }
            else{
                token.position.y += step;
                totalY += step;
                yLoc += step;
                tempY = yLoc += step;
            }
            if(totalY == moveY){
                update = true;
                totalY = 0;
            }
        }
        else{
            if(tempY > 0)
                tempY -= 100;
            else
                tempY += 100;
            moveY *= -1;
        }


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
            case 37: {// left arrow
                camera.matrixAutoUpdate = false;
                camera.matrixWorld.multiply(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(5)));
                scene.updateMatrixWorld(true);
                break;
            }
            case 38: {// up arrow
                camera.matrixAutoUpdate = false;
                camera.matrixWorld.multiply(new THREE.Matrix4().makeTranslation(0, 0, -50));
                scene.updateMatrixWorld(true);
                break;
            }
            case 39: { // right arrow
                camera.matrixAutoUpdate = false;
                camera.matrixWorld.multiply(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(-5)));
                scene.updateMatrixWorld(true);
                break;
            }
            case 40: { // down arrow
                camera.matrixAutoUpdate = false;
                camera.matrixWorld.multiply(new THREE.Matrix4().makeTranslation(0, 0, 50));
                scene.updateMatrixWorld(true);
                break;
            }
            case 73: { /* i */
                ballRingCF.multiply(moveYpos);
                ballCF.multiply(new THREE.Matrix4().makeRotationX((-50/100)));
                //ballCF.multiply(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(5)));
                break;
            }
            case 74:  /* j */
                ballRingCF.multiply(rotZpos);
                break;
            case 75:  /* k */
                ballRingCF.multiply(moveYneg);
                ballCF.multiply(new THREE.Matrix4().makeRotationX(50/100));
                break;
            case 76:  /* j */
                ballRingCF.multiply(rotZneg);
                break;
        }
    }

});
