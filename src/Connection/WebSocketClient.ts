import PlayersManager, { IPlayerIdAndPlayerWorldLocationMap } from "../Objects/PlayersManager";

export default class WebSocketClient {
    client: WebSocket;
    token: string;
    constructor(ip: string, port: number, token: string) {
        this.client = new WebSocket(ip + ":" + port)
        this.token = token;
        this._Init();
    }

    _Init() {
        const tokenStr = this.token;
        this.client.onopen = function (event) {
            this.send(tokenStr);
        };
        this.client.onmessage = function (event) {
            let playersPositions: IPlayerIdAndPlayerWorldLocationMap = {};
            JSON.parse(event.data).map(player => {
                playersPositions[player.Id] = 
                { 
                    position: {x: player.Position.X, y: player.Position.Y, z: player.Position.Z},
                    quaternion: {w: player.Quaternion.W, x: player.Quaternion.X, y: player.Quaternion.Y, z: player.Quaternion.Z},
                };
            })
            delete playersPositions[tokenStr] // remove player`s own ID
            PlayersManager.updatePlayers(playersPositions)
        };

    }

    sendToServer(message: string) {
        this.client.send(message);
    }

}




