import * as THREE from "three";
import { Quaternion, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import Stats from "three/examples/jsm/libs/stats.module";
import PlayerController from "./PlayerController";

let prevTime = performance.now();
let direction = new THREE.Vector3();
let velocity = new THREE.Vector3();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0000ff);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100000
);
camera.position.z = 1000;
camera.position.y = 300;
//camera.position.x = 100;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const stats = Stats();
document.body.appendChild(stats.dom);

// global map
// map.push()
// map.get(id).position.x= somet[1]

const controls = new OrbitControls(camera, renderer.domElement);
// const controls = new PointerLockControls(camera, renderer.domElement);
// document.addEventListener("click", function () {
//     controls.lock();
// });

const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1000, 1000);
const material = new THREE.MeshBasicMaterial({
    color: 0x00000,
    side: THREE.DoubleSide,
});
planeGeometry.rotateX(-Math.PI / 2);
const plane = new THREE.Mesh(planeGeometry, material);
scene.add(plane);
plane.position.set(0, -20, 0);

const geometry = new THREE.BoxGeometry();
const bodyMesh = new THREE.MeshBasicMaterial({
    color: 0xeb4034,
    wireframe: false,
});
const headMesh = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: false,
});

const aim = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial({ color: 0xaaaaaa })
);
//testObj.position.set(500, 500, 500);
//scene.add(testObj);
const testObj2 = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial({ color: 0xaaaaaa })
);
testObj2.scale.set(50, 50, 50);
scene.add(testObj2);

const body = new THREE.Mesh(geometry, bodyMesh);
const head = new THREE.Mesh(geometry, headMesh);
const head2 = new THREE.Mesh(geometry, headMesh);
const humanGroup = new THREE.Group();
const playerParent = new THREE.Group();
body.scale.set(20, 20, 20);
humanGroup.add(body);
head.scale.set(10, 10, 10);
head2.scale.set(10, 100, 21);
head2.position.set(10, 0, 0);
humanGroup.add(head);
humanGroup.add(head2);
head.position.set(0, 15, 0);
//humanGroup.add(camera);
// aim.scale.set(500, 500, 500)
// aim.position.set(0, 0, 800);
// humanGroup.add(aim);
playerParent.add(humanGroup);
//playerParent.add(camera);
scene.add(playerParent);


//resize window
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function move(delta: number) {
    // var direction = new THREE.Vector3();
    // camera.getWorldDirection(direction);
    var direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    // console.log(direction);

    // const matrix = camera.matrixWorld;
    //console.log(matrix)
    // const forward = new THREE.Vector3(
    //     -matrix.elements[8],
    //     -matrix.elements[9],
    //     -matrix.elements[10]
    // );
    const forward = direction;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    //velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    // direction.z =
    //     Number(playerController.moveForward) -
    //     Number(playerController.moveBackward);
    // direction.x =
    //     Number(playerController.moveRight) - Number(playerController.moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (playerController.moveForward || playerController.moveRight || playerController.moveBackward || playerController.moveLeft) {
        if (playerController.moveForward) {

            //direction.add(forward.multiplyScalar(0.000001));
            velocity.z += direction.z * 4000.0 * delta;
            velocity.x += direction.x * 4000.0 * delta;
        }
        if (playerController.moveRight) {
            //direction.add(forward.multiplyScalar(0.000001));
            velocity.z += direction.x * 4000.0 * delta;
            velocity.x -= direction.z * 4000.0 * delta;
        }
        if (playerController.moveBackward) {
            //direction.add(forward.multiplyScalar(0.000001));
            velocity.z -= direction.z * 4000.0 * delta;
            velocity.x -= direction.x * 4000.0 * delta;
        }
        if (playerController.moveLeft) {
            //direction.add(forward.multiplyScalar(0.000001));
            velocity.z -= direction.x * 4000.0 * delta;
            velocity.x += direction.z * 4000.0 * delta;
        }

        const playerPosition = playerParent.position;
        playerParent.position.set(
            playerPosition.x + velocity.x * delta,
            0,
            playerPosition.z + velocity.z * delta
        );
        const cPosition = camera.position;
        camera.position.set(
            cPosition.x + velocity.x * delta,
            cPosition.y,
            cPosition.z + velocity.z * delta
        );
    }


    // if (
    //     playerController.moveForward ||
    //     playerController.moveBackward ||
    //     playerController.moveLeft ||
    //     playerController.moveRight
    // ) {
    //     velocity.x -= direction.z * 4000.0 * delta;
    //     velocity.z -= direction.x * 4000.0 * delta;
    // }

    // controls.moveRight(-velocity.x * delta);
    // controls.moveForward(-velocity.z * delta);

    //console.log(playerPosition);

    //humanGroup.updateMatrix();
}

const playerController = new PlayerController(humanGroup);
document.addEventListener("keydown", playerController.onKeyDown);
document.addEventListener("keyup", playerController.onKeyUp);

const websocket = new WebSocket("3.140.210.21:5000", "TCP")
websocket.onopen = function (event) {
    websocket.send("a138d77c-90a0-4ff7-8b9d-e222a90bc3b8");
};
websocket.onmessage = function (event) {
    console.log(event.data)
    //websocket.send("a138d77c-90a0-4ff7-8b9d-e222a90bc3b8");
};

controls.minDistance = 500
controls.maxDistance = 1000
controls.minPolarAngle = Math.PI / 4
controls.maxPolarAngle = Math.PI / 2.1
controls.rotateSpeed = 0.2
controls.enableDamping = true
controls.dampingFactor = 0.2



function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    move(delta);

    //controls.target.set(playerParent.position.x, playerParent.position.y, playerParent.position.z)

    var playerDirection = new THREE.Vector3();
    humanGroup.getWorldDirection(playerDirection)
    playerDirection.normalize();

    const r = 250
    if (playerDirection.z === 0) {
        playerDirection.z = 0.001
    }
    if (playerDirection.x === 0) {
        playerDirection.x = 0.001
    }


    var direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.multiplyScalar(Number.MAX_SAFE_INTEGER)
    humanGroup.lookAt(direction.x, playerParent.position.y, direction.z);

    const a = Math.sqrt(r * r / (playerDirection.x * playerDirection.x + playerDirection.z * playerDirection.z))
    // const angle = Math.atan2(playerDirection.x , playerDirection.z)
    // const a = Math.sin(angle) * r / playerDirection.x
    // const b = Math.sin(angle) * r / playerDirection.z


    let aimX = playerParent.position.x + playerDirection.x * a
    let aimY = playerParent.position.y + playerDirection.y
    let aimZ = playerParent.position.z + playerDirection.z * a

    const distance = controls.getDistance()
    testObj2.position.set(aimX, aimY, aimZ);
    console.log(distance)
    controls.target.set(aimX, aimY, aimZ)
    controls.update();

    // var newDir = new THREE.Vector3(100, 0, 100);
    // var pos = new THREE.Vector3();
    // pos.addVectors(
    //     new Vector3(camera.position.x, 0, camera.position.z),
    //     playerParent.position
    // );


    // const tq = new THREE.Quaternion();
    // playerParent.getWorldQuaternion(tq);
    //playerParent.setRotationFromQuaternion(camera.quaternion);
    // var test = new THREE.Vector3();
    //camera.lookAt(humanGroup.position);
    stats.update();
    prevTime = time;
    render();
}

function render() {
    renderer.render(scene, camera);
}

animate();
