import { DefaultEventsMap } from "@socket.io/component-emitter";
import { io, Socket } from "socket.io-client"

export class SocketClient {

    private socket: Socket<DefaultEventsMap, DefaultEventsMap>;

    constructor(url: string) {
        this.socket = io(url)
    }

    getInstance(){
        return this.socket;
    }

}