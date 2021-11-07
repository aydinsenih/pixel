import * as THREE from "three";
import Camera from "./Camera";
import Scene from "./World/Scene";

export default class Render {
    constructor() {
        Render.Renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(Render.Renderer.domElement);
    }
    static Renderer = new THREE.WebGLRenderer();

    static _Render() {
        this.Renderer.render(Scene.GlobalScene, Camera.UserCamera);
    }

}