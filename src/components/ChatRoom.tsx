import { MessageCircle } from "lucide-react";
import { useState } from "react";
import ChatMessageWindow from "./ChatMessageWindow";

const ChatRoom = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      {isChatOpen ? (
        <ChatMessageWindow onClose={() => setIsChatOpen(false)} />
      ) : (
        <ChatMessageIcon onClick={() => setIsChatOpen(true)} />
      )}
    </>
  );
};

export default ChatRoom;

const ChatMessageIcon = ({ onClick }: { onClick: () => void }) => {
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
      </button>
    </div>
  );
};
