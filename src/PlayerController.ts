import * as THREE from "three";
import Camera from "./Camera";
import Player from "./Objects/Player";

export default class PlayerController {
    character: Player;
    moveForward: boolean = false;
    moveLeft: boolean = false;
    moveBackward: boolean = false;
    moveRight: boolean = false;
    velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    playerCamera: Camera;
    constructor(characterObject: Player, playerCamera: Camera) {
        this.character = characterObject;
        this.playerCamera = playerCamera;
    }

    onKeyDown = (event: any) => {
        switch (event.code) {
            case "ArrowUp":
            case "KeyW":
                this.moveForward = true;
                //this.character.position.z -= 0.1;
                break;

            case "ArrowLeft":
            case "KeyA":
                this.moveLeft = true;
                //this.character.position.x -= 0.1;
                break;

            case "ArrowDown":
            case "KeyS":
                this.moveBackward = true;
                //this.character.position.z += 0.1;
                break;

            case "ArrowRight":
            case "KeyD":
                this.moveRight = true;
                //this.character.position.x += 0.1;
                break;

            // case 'Space':
            //     if ( canJump === true ) velocity.y += 350;
            //     canJump = false;
            //     break;
        }
    };

    onKeyUp = (event: any) => {
        switch (event.code) {
            case "ArrowUp":
            case "KeyW":
                this.moveForward = false;
                //this.character.position.z -= 0.1;
                break;

            case "ArrowLeft":
            case "KeyA":
                this.moveLeft = false;
                //this.character.position.x -= 0.1;
                break;

            case "ArrowDown":
            case "KeyS":
                this.moveBackward = false;
                //this.character.position.z += 0.1;
                break;

            case "ArrowRight":
            case "KeyD":
                this.moveRight = false;
                //this.character.position.x += 0.1;
                break;

            // case 'Space':
            //     if ( canJump === true ) velocity.y += 350;
            //     canJump = false;
            //     break;
        }
    };

    moveScale = 20;
    _Move(delta: number) {
        var direction = new THREE.Vector3();
        Camera.UserCamera.getWorldDirection(direction);

        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;
        direction.normalize(); // this ensures consistent movements in all directions

        if (this.moveForward || this.moveRight || this.moveBackward || this.moveLeft) {
            if (this.moveForward) {

                //direction.add(forward.multiplyScalar(0.000001));
                this.velocity.z += direction.z * this.moveScale * delta;
                this.velocity.x += direction.x * this.moveScale * delta;
            }
            if (this.moveRight) {
                //direction.add(forward.multiplyScalar(0.000001));
                this.velocity.z += direction.x * this.moveScale * delta;
                this.velocity.x -= direction.z * this.moveScale * delta;
            }
            if (this.moveBackward) {
                //direction.add(forward.multiplyScalar(0.000001));
                this.velocity.z -= direction.z * this.moveScale * delta;
                this.velocity.x -= direction.x * this.moveScale * delta;
            }
            if (this.moveLeft) {
                //direction.add(forward.multiplyScalar(0.000001));
                this.velocity.z -= direction.x * this.moveScale * delta;
                this.velocity.x += direction.z * this.moveScale * delta;
            }

            const playerPosition = this.character.humanGroup.position;
            this.character.humanGroup.position.set(
                playerPosition.x + this.velocity.x * delta,
                playerPosition.y,
                playerPosition.z + this.velocity.z * delta
            );
            const cPosition = Camera.UserCamera.position;
            Camera.UserCamera.position.set(
                cPosition.x + this.velocity.x * delta,
                cPosition.y,
                cPosition.z + this.velocity.z * delta
            );
        }
    }

    _Rotation() {
        var playerDirection = new THREE.Vector3();
        this.character.humanGroup.getWorldDirection(playerDirection)
        playerDirection.normalize();

        const r = 20
        if (playerDirection.z === 0) {
            playerDirection.z = 0.001
        }
        if (playerDirection.x === 0) {
            playerDirection.x = 0.001
        }
        var direction = new THREE.Vector3();
        Camera.UserCamera.getWorldDirection(direction);
        direction.multiplyScalar(Number.MAX_SAFE_INTEGER)
        this.character.humanGroup.lookAt(direction.x, this.character.humanGroup.position.y, direction.z);

        const rotationFactor = Math.sqrt(r * r / (playerDirection.x * playerDirection.x + playerDirection.z * playerDirection.z))

        let aimX = this.character.humanGroup.position.x + playerDirection.x * rotationFactor;
        let aimY = this.character.humanGroup.position.y + playerDirection.y;
        let aimZ = this.character.humanGroup.position.z + playerDirection.z * rotationFactor;

        //this.playerAim.position.set(aimX, aimY, aimZ);
        Camera.UserControls.target.set(aimX, aimY, aimZ)
        Camera.UserControls.update();
    }
}
