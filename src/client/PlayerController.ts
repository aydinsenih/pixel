import * as THREE from "three";

export default class PlayerController {
    character: THREE.Group;
    moveForward: boolean = false;
    moveLeft: boolean = false;
    moveBackward: boolean = false;
    moveRight: boolean = false;
    constructor(characterObject: THREE.Group) {
        this.character = characterObject;
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

    _Move() {
        console.log("a");
    }
}
