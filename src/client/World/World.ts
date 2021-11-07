import * as THREE from "three";

export default class World {
    floor: THREE.Mesh;
    constructor(width: number, height: number, widthSegments: number, heightSegments: number) {
        this.floor = new THREE.Mesh(new THREE.PlaneGeometry(width, height, widthSegments, heightSegments), new THREE.MeshBasicMaterial({
            color: 0x5ead53,
            side: THREE.DoubleSide
        }))
        this.floor.rotateX(-Math.PI / 2);
    }

}



