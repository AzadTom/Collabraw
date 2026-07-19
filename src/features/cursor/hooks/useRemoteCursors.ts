import { useEffect, useState } from "react";
import { cursorService } from "../services";
import { Cursor } from "../services/socket.type";

export const useRemoteCursors = () => {
    const [cursors, setCursors] = useState<Record<string, Cursor>>({});

    useEffect(() => {
        const unsubscribe = cursorService.subscribe((cursor) => {

            console.log("cursor",cursor);
            setCursors(prev => ({
                ...prev,
                [cursor.userId]: cursor,
            }));
        });

        return unsubscribe;
    }, []);

    return cursors;
}