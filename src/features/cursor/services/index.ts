
import { URL } from "@/utils/constant";
import { CursorService } from "./cursor.service"
import { SocketClient } from "./socket.service";

const socket = new SocketClient(URL);
export const cursorService = new CursorService(socket)