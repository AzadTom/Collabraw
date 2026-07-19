import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, Plus } from "lucide-react";

interface RoomFullDialogProps {
  socket?: Socket;
}

export const RoomFullDialog: React.FC<RoomFullDialogProps> = ({ socket }) => {
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleRoomFull = () => {
      setIsFull(true);
    };

    socket.on("room-full", handleRoomFull);

    return () => {
      socket.off("room-full", handleRoomFull);
    };
  }, [socket]);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleCreateNewRoom = () => {
    const newRoomId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : uuidv4();
    window.location.href = `/room/${newRoomId}`;
  };

  return (
    <Dialog open={isFull} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md border border-neutral-200 bg-white text-black shadow-2xl transition-all duration-300 !p-6"
      >
        <DialogHeader className="space-y-3 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-1">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-zinc-700">
            Room is Full
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-sm leading-relaxed text-center">
            Room is full, no other user can join this room. Sorry!
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="!pt-4 flex flex-col sm:flex-row gap-3 sm:justify-center">
          <Button
            onClick={handleGoHome}
            className="w-full sm:w-auto font-semibold !px-6 !py-5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Home Page
          </Button>

          <Button
            variant="outline"
            onClick={handleCreateNewRoom}
            className="w-full sm:w-auto font-semibold text-white !px-6 !py-5 border-neutral-300 hover:bg-neutral-100 hover:text-black transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomFullDialog;
