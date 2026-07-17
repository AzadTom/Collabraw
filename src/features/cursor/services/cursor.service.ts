import { Cursor } from "./socket.type";
import { SocketClient } from "./socket.service";



export class CursorService {

    constructor(
        private socket: SocketClient
    ) {}

    send(cursor: Cursor) {

        this.socket.emit("cursor:move", cursor)

    }

    subscribe(callback: (cursor: Cursor) => void) {

        this.socket.on("cursor:move", callback)

    }

    unsubscribe(callback: (cursor: Cursor) => void) {

        this.socket.off("cursor:move", callback)

    }

}