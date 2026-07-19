import React, { useState, useEffect, useRef } from "react";
import { Send, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/useUserStore";
import { useRoomId } from "@/features/room/hooks/useRoomId";
import { socketInstance as socket } from "@/features/cursor/services";
import { v4 as uuidv4 } from "uuid";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

interface ChatMessageWindowProps {
  onClose: () => void;
}

const ChatMessageWindow: React.FC<ChatMessageWindowProps> = ({ onClose }) => {
  const { username, userId } = useUserStore((state) => state);
  const roomId = useRoomId();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleIncomingMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("chat:message", handleIncomingMessage);

    return () => {
      socket.off("chat:message", handleIncomingMessage);
    };
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputMsg.trim();
    if (!trimmed) return;

    const newMsg: ChatMessage = {
      id: uuidv4(),
      senderId: userId || "anonymous",
      senderName: username || "Guest",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Optimistically update local state
    setMessages((prev) => [...prev, newMsg]);

    // Emit to room over socket
    socket.emit("chat:message", {
      roomId,
      message: newMsg,
    });

    setInputMsg("");
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 z-[99999] h-screen w-full sm:w-80 md:w-96 bg-background/95 backdrop-blur-md border-l border-border shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      {/* Header */}
      <div className="flex items-center justify-between !px-4 !py-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-none text-foreground">Room Chat</h3>
            <span className="text-[11px] text-muted-foreground">
              Room: <span className="font-mono">{roomId}</span>
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-full hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto !p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground space-y-2">
            <MessageSquare className="w-10 h-10 stroke-1 opacity-40" />
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs opacity-75">
              Say hello to start the conversation <br /> with other collaborators in this room!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === userId;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                {!isMe && (
                  <span className="text-[10px] font-semibold text-muted-foreground mb-0.5 !px-2 !py-2">
                    {msg.senderName}
                  </span>
                )}
                <div
                  className={`max-w-[85%] !px-2 !py-1 rounded-2xl text-sm leading-relaxed break-words shadow-xs ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground border border-border/50 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-muted-foreground mt-0.5 px-1 opacity-70">
                  {msg.timestamp}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="!p-3 border-t border-border bg-card/30 flex gap-2 items-center">
        <Input
          type="text"
          placeholder="Type a message..."
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          className="flex-1 !p-2 text-sm bg-background border-border focus-visible:ring-1"
        />
        <Button
          type="submit"
          disabled={!inputMsg.trim()}
          size="icon"
          className="h-9 w-9 shrink-0 rounded-lg shadow-xs"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatMessageWindow;
