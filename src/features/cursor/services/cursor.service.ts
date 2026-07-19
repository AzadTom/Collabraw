import { Cursor } from "./socket.type";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";



export class CursorService {

    constructor(
        private socket: Socket<DefaultEventsMap, DefaultEventsMap>
    ) {}

    send(roomId: string, cursor: Cursor) {

        this.socket.emit("cursor:move", { roomId, cursor })

    }

    subscribe(callback: (cursor: Cursor) => void) {

        this.socket.on("cursor:move", callback)

    }

    unsubscribe(callback: (cursor: Cursor) => void) {

        this.socket.off("cursor:move", callback)

    }

}