import Scene from "../World/Scene";
import Player from "./Player";

export interface IPosition {
    x: number,
    y: number,
    z: number,
}
export interface IPlayerPosition {
    [playerID: string]: IPosition;
}

export default class PlayersManager {
    constructor() {
    }

    static activePlayerList = new Array<Player>();

    static addPlayer(playerID: string, position: IPosition) {
        const newPlayer = new Player(playerID);
        newPlayer.humanGroup.position.set(position.x, position.y, position.z);
        PlayersManager.activePlayerList.push(newPlayer);
        Scene.add(newPlayer.humanGroup);
    }

    static removePlayer(playerID: string) {
        PlayersManager.activePlayerList = PlayersManager.activePlayerList.filter(p => p.id !== playerID);// TODO: kopyalamadan degistir.
    }

    static updatePlayers(playerPosition: IPlayerPosition) {
        for (let i = 0; i < PlayersManager.activePlayerList.length; i++) {
            const selectedPlayer = playerPosition[PlayersManager.activePlayerList[i].id];
            if (selectedPlayer) {
                PlayersManager.activePlayerList[i].humanGroup.position.set(selectedPlayer.x, selectedPlayer.y, selectedPlayer.z);
                delete playerPosition[PlayersManager.activePlayerList[i].id]
            } else {
                this.removePlayer(PlayersManager.activePlayerList[i].id)
            }
        }
        for (let key in playerPosition) {
            this.addPlayer(key, playerPosition[key]);
        }
    }
}