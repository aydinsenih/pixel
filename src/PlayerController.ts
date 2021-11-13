import * as THREE from "three";
import Camera from "./Camera";
import Player from "./Objects/Player";

export default class PlayerController {
    character: Player;
    moveForward: boolean = false;
    moveLeft: boolean = false;
    moveBackward: boolean = false;
    moveRight: boolean = false;
    Jump: boolean = false;
    canJump: boolean = true;
    velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    playerCamera: Camera;

    rotateCharacter: boolean = false;
    rotateOnlyCamera: boolean = false;

    constructor(characterObject: Player, playerCamera: Camera) {
        this.character = characterObject;
        this.playerCamera = playerCamera;
        this._initCamera();
    }

    onKeyDown = (event: any) => {
        switch (event.code) {
            case "ArrowUp":
            case "KeyW":
                this.moveForward = true;
                break;

            case "ArrowLeft":
            case "KeyA":
                this.moveLeft = true;
                break;

            case "ArrowDown":
            case "KeyS":
                this.moveBackward = true;
                break;

            case "ArrowRight":
            case "KeyD":
                this.moveRight = true;
                break;

            case 'Space':
                if ( this.canJump === true ) this.Jump = true;
                this.canJump = false;
                break;
        }
    };

    onKeyUp = (event: any) => {
        switch (event.code) {
            case "ArrowUp":
            case "KeyW":
                this.moveForward = false;
                break;

            case "ArrowLeft":
            case "KeyA":
                this.moveLeft = false;
                break;

            case "ArrowDown":
            case "KeyS":
                this.moveBackward = false;
                break;

            case "ArrowRight":
            case "KeyD":
                this.moveRight = false;
                break;
        }
    };

    onMouseDown = (event: any) => {
        switch (event.which) {
            case 1:
                this.rotateCharacter = true;
                break;

            case 3:
                this.rotateOnlyCamera = true;
                break;
        }
        
    };
    
    onMouseUp = (event: any) => {
        switch (event.which) {
            case 1:
                this.rotateCharacter = false;
                break;

            case 3:
                this.rotateOnlyCamera = false;
                break;
        }
        
    };

    moveScale = 20;
    jumpScale = 5000;
    gravity = 100;
    _Move(delta: number) {
        
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;
        this.velocity.y -= this.velocity.y * 10.0 * delta;

        if (this.moveForward || this.moveRight || this.moveBackward || this.moveLeft || this.Jump) {

            var playerDirection = new THREE.Vector3();
            this.character.humanGroup.getWorldDirection(playerDirection);
            playerDirection.normalize();

            if (this.moveForward) {
                this.velocity.z += playerDirection.z * this.moveScale * delta;
                this.velocity.x += playerDirection.x * this.moveScale * delta;
            }
            if (this.moveRight) {
                this.velocity.z += playerDirection.x * this.moveScale * delta;
                this.velocity.x -= playerDirection.z * this.moveScale * delta;
            }
            if (this.moveBackward) {
                this.velocity.z -= playerDirection.z * this.moveScale * delta;
                this.velocity.x -= playerDirection.x * this.moveScale * delta;
            }
            if (this.moveLeft) {
                this.velocity.z -= playerDirection.x * this.moveScale * delta;
                this.velocity.x += playerDirection.z * this.moveScale * delta;
            }
            if (this.Jump) {
                this.velocity.y += this.jumpScale * delta;
                this.canJump = false;
                this.Jump = false;
            }

        }

        const playerPosition = this.character.humanGroup.position;

        if ( !this.canJump) {

            this.velocity.y -= this.gravity * delta;
        }

        if(playerPosition.y < 50){
            playerPosition.y = 50;
            this.velocity.y = 0;
            this.canJump = true;
        }
    

        this.character.humanGroup.position.set(
            playerPosition.x + this.velocity.x * delta,
            playerPosition.y + this.velocity.y * delta,
            playerPosition.z + this.velocity.z * delta
        );

        const cPosition = Camera.UserCamera.position;
        Camera.UserCamera.position.set(
            cPosition.x + this.velocity.x * delta,
            cPosition.y + this.velocity.y * delta,
            cPosition.z + this.velocity.z * delta
        );
        this.updateCamera()

    }

   
    _Rotation() {
       
        if (this.rotateCharacter || this.rotateOnlyCamera) {
            this.updateCamera()
        }
    }

    _initCamera(){
        var playerDirection = new THREE.Vector3();
        this.character.humanGroup.getWorldDirection(playerDirection);
        playerDirection.normalize();
        
        const r = 20
        const rotationFactor = Math.sqrt(r**2 / (playerDirection.x**2 + playerDirection.z**2))

        let aimX = this.character.humanGroup.position.x + playerDirection.x * rotationFactor;
        let aimY = this.character.humanGroup.position.y + playerDirection.y;
        let aimZ = this.character.humanGroup.position.z + playerDirection.z * rotationFactor;

        Camera.UserControls.target.set(aimX, aimY, aimZ)
        Camera.UserControls.update();
    }

    updateCamera(){

        var playerPosition = this.character.humanGroup.position
        var cameraPosition = Camera.UserCamera.position

        var newDirection = new THREE.Vector3();
        newDirection.subVectors(playerPosition , cameraPosition)

        newDirection.normalize();
        
        const r = 20
        const rotationFactor = Math.sqrt(r**2 / (newDirection.x**2 + newDirection.z**2))

        let aimX = this.character.humanGroup.position.x + newDirection.x * rotationFactor;
        let aimY = this.character.humanGroup.position.y + newDirection.y;
        let aimZ = this.character.humanGroup.position.z + newDirection.z * rotationFactor;

        if(this.rotateCharacter)
            this.character.humanGroup.lookAt(aimX, aimY, aimZ);
        Camera.UserControls.target.set(aimX, aimY, aimZ)
        Camera.UserControls.update();
    }
}
