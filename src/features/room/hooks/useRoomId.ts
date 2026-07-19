import { useParams } from "react-router-dom";

export const useRoomId = () => {
    const { roomId } = useParams();
    return roomId ? roomId : "roomhome";
}