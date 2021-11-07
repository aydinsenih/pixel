import * as THREE from "three";

export default class Scene {
    constructor() {
        Scene.GlobalScene = new THREE.Scene();
    }

    static GlobalScene;

    static add(object: THREE.Object3D | THREE.Group | THREE.Mesh) {
        Scene.GlobalScene.add(object);
    }

}