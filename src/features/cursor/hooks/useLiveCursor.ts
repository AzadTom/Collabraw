import { useEffect } from "react";
import { cursorService } from "../services";
import { useRoomId } from "@/features/room/hooks/useRoomId";

interface User {
  id: string;
  name: string;
}

const COLORS = [
  "#3b82f6", // blue
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#f97316", // orange
  "#06b6d4", // cyan
];

const getUserColor = (userId: string) => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
};

export function useLiveCursor(user: User | null) {
  const roomId = useRoomId();

  useEffect(() => {
    if (!user) return;

    const userColor = getUserColor(user.id);

    const handlePointerMove = (event: PointerEvent) => {
      cursorService.send(roomId, {
        userId: user.id,
        x: event.clientX,
        y: event.clientY,
        color: userColor,
        name: user.name,
      });
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [user, roomId]);
}