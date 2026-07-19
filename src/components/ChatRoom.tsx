import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import ChatMessageWindow, { ChatMessage } from "./ChatMessageWindow";
import { socketInstance as socket } from "@/features/cursor/services";
import { useUserStore } from "@/stores/useUserStore";

const ChatRoom = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { userId } = useUserStore((state) => state);

  useEffect(() => {
    const handleIncomingMessage = (msg: ChatMessage) => {
      if (!isChatOpen && msg.senderId !== userId) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("chat:message", handleIncomingMessage);

    return () => {
      socket.off("chat:message", handleIncomingMessage);
    };
  }, [isChatOpen, userId]);

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setUnreadCount(0);
  };

  return (
    <>
      {isChatOpen ? (
        <ChatMessageWindow onClose={() => setIsChatOpen(false)} />
      ) : (
        <ChatMessageIcon onClick={handleOpenChat} unreadCount={unreadCount} />
      )}
    </>
  );
};

export default ChatRoom;

const ChatMessageIcon = ({
  onClick,
  unreadCount,
}: {
  onClick: () => void;
  unreadCount: number;
}) => {
  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-50 flex items-end">
      <button
        type="button"
        aria-label="Open messages"
        onClick={onClick}
        className="group relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 via-neutral-900 to-black text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)] ring-1 ring-black/20 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)] focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
      >
        <span className="absolute inset-0 rounded-2xl bg-cyan-400/15 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
        <MessageCircle
          className="relative z-10 text-white transition-transform duration-300 group-hover:scale-110"
          size={23}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-black shadow-lg animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
