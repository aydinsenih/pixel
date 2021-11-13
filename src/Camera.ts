import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Render from "./Render";

export default class Camera {
    constructor(fov: number, far: number) {
        Camera.UserCamera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, far);
        Camera.UserControls = new OrbitControls(Camera.UserCamera, Render.Renderer.domElement);
        this.controlsSettings();
    }
    static UserCamera;
    static UserControls;

    static onWindowResize() {
        Camera.UserCamera.aspect = window.innerWidth / window.innerHeight;
        Camera.UserCamera.updateProjectionMatrix();
        Render.Renderer.setSize(window.innerWidth, window.innerHeight);
        Render._Render();
    }

    controlsSettings() {
        Camera.UserControls.minDistance = 35
        Camera.UserControls.maxDistance = 50
        Camera.UserControls.minPolarAngle = Math.PI / 4
        Camera.UserControls.maxPolarAngle = Math.PI / 2.1
        Camera.UserControls.rotateSpeed = 0.2
        Camera.UserControls.enableDamping = true
        Camera.UserControls.dampingFactor = 0.2
        Camera.UserControls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE
        }
    }

}