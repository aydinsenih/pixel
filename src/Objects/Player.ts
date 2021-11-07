import * as THREE from "three";


export default class Player {
    humanGroup: THREE.Group;
    id: string;
    constructor(id: string) {
        this.id = id;
        const geometry = new THREE.BoxGeometry();
        const bodyMesh = new THREE.MeshBasicMaterial({
            color: 0xeb4034,
            wireframe: false,
        });
        const headMesh = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: false,
        });

        const body = new THREE.Mesh(geometry, bodyMesh);
        const head = new THREE.Mesh(geometry, headMesh);
        const arm = new THREE.Mesh(geometry, headMesh);
        this.humanGroup = new THREE.Group();
        body.scale.set(2, 2, 2);
        this.humanGroup.add(body);
        head.scale.set(1, 1, 1);
        arm.scale.set(1, 1, 4);
        head.position.set(0, 1, 0);
        arm.position.set(1, 0, 2);
        this.humanGroup.add(head);
        this.humanGroup.add(arm);
    }



}