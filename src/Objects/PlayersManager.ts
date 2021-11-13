import Scene from "../World/Scene";
import Player from "./Player";

export interface IPosition {
    x: number,
    y: number,
    z: number,
}
export interface IQuaternion {
    w: number,
    x: number,
    y: number,
    z: number,
}
export interface IPlayerWorldLocation {
    position: IPosition,
    quaternion: IQuaternion,
}
export interface IPlayerIdAndPlayerWorldLocationMap {
    [playerID: string]: IPlayerWorldLocation,
}

export default class PlayersManager {
    constructor() {
    }

    static activePlayerList = new Array<Player>();

    static addPlayer(playerID: string, playerWorldLocation: IPlayerWorldLocation) {
        const newPlayer = new Player(playerID);
        newPlayer.humanGroup.position.set(playerWorldLocation.position.x, playerWorldLocation.position.y, playerWorldLocation.position.z);
        newPlayer.humanGroup.quaternion.set(playerWorldLocation.quaternion.x, playerWorldLocation.quaternion.y, playerWorldLocation.quaternion.z, playerWorldLocation.quaternion.w);
        PlayersManager.activePlayerList.push(newPlayer);
        newPlayer.humanGroup.name = playerID;
        Scene.add(newPlayer.humanGroup);
    }

    static removePlayer(player: Player) {
        const object = Scene.GlobalScene.getObjectByProperty('name', player.id);
        Scene.GlobalScene.remove(object);
    }

    static updatePlayers(playerIdAndPlayerWorldLocationMap: IPlayerIdAndPlayerWorldLocationMap) {
        for (let i = 0; i < PlayersManager.activePlayerList.length; i++) {
            const selectedPlayer = playerIdAndPlayerWorldLocationMap[PlayersManager.activePlayerList[i].id];
            if (selectedPlayer) {
                PlayersManager.activePlayerList[i].humanGroup.position.set(selectedPlayer.position.x, selectedPlayer.position.y, selectedPlayer.position.z);
                PlayersManager.activePlayerList[i].humanGroup.quaternion.set(selectedPlayer.quaternion.x, selectedPlayer.quaternion.y, selectedPlayer.quaternion.z, selectedPlayer.quaternion.w);
                delete playerIdAndPlayerWorldLocationMap[PlayersManager.activePlayerList[i].id]
            } else {
                this.removePlayer(PlayersManager.activePlayerList[i])
            }
        }
        for (let key in playerIdAndPlayerWorldLocationMap) {
            this.addPlayer(key, playerIdAndPlayerWorldLocationMap[key]);
        }
    }
}