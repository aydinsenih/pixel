import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import PlayerController from "./PlayerController";
import Camera from "./Camera";
import Render from "./Render";
import Player from "./Objects/Player";
import Scene from "./World/Scene";
import World from "./World/World";
import WebSocketClient from "./Connection/WebSocketClient";
import { v4 as uuidv4 } from 'uuid';

let prevTime = performance.now();
const stats = Stats();
var playerController;

function init() {
    document.body.appendChild(stats.dom);
    const playerCamera = new Camera(75, 1000);
    const user = new Player(uuidv4());
    const socket = new WebSocketClient("ws://3.140.210.21", 5000, user.id);
    playerController = new PlayerController(user, playerCamera);
    new Render();
    new Scene();
    const world = new World(1000, 1000, 1000, 1000);
    Scene.GlobalScene.background = new THREE.Color(0x352ee8);
    Scene.add(world.floor);
    Scene.add(user.humanGroup);
    Scene.add(Camera.UserCamera);
    user.humanGroup.position.setY(50);

    setInterval(function () {
        socket.client.send(JSON.stringify({
            X: user.humanGroup.position.x,
            Y: user.humanGroup.position.y,
            Z: user.humanGroup.position.z,
        }))
    }, 50);

    //resize window
    window.addEventListener("resize", Camera.onWindowResize, false);

    //track keystrokes
    document.addEventListener("keydown", playerController.onKeyDown);
    document.addEventListener("keyup", playerController.onKeyUp);
}


function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    playerController._Move(delta);
    playerController._Rotation();

    stats.update();
    prevTime = time;
    Render._Render();
}

// function render() {
//     renderer.render(scene, camera);
// }
init();
animate();