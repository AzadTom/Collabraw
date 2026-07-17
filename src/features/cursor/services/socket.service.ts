import { io, Socket } from "socket.io-client"

export class SocketClient {

    private socket: Socket

    constructor(url: string) {

        console.log("I am in socket client");
        this.socket = io(url)

    }

    emit(event: string, payload: unknown) {

        this.socket.emit(event, payload)

    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event: string, callback: (...args: any[]) => void) {

        this.socket.on(event, callback)

    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    off(event: string, callback: (...args: any[]) => void) {

        this.socket.off(event, callback)

    }

}