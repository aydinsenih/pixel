import PlayersManager, { IPlayerPosition } from "../Objects/PlayersManager";

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
            let playersPositions: IPlayerPosition = {};
            JSON.parse(event.data).map(data => {
                playersPositions[data.Id] = { x: data.Position.X, y: data.Position.Y, z: data.Position.Z };
            })
            delete playersPositions[tokenStr] // remove player`s own ID
            PlayersManager.updatePlayers(playersPositions)
        };

    }

    sendToServer(message: string) {
        this.client.send(message);
    }

}




