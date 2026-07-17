import React from "react";
import { useRemoteCursors } from "../hooks/useRemoteCursors";

interface RemoteCursorsProps {
  currentUserId?: string;
}

export const RemoteCursors: React.FC<RemoteCursorsProps> = ({ currentUserId }) => {
  const remoteCursors = useRemoteCursors();

  return (
    <>
      {Object.values(remoteCursors)
        .filter((cursor) => cursor.userId !== currentUserId)
        .map((remoteUser) => (
          <div
            key={remoteUser.userId}
            style={{
              position: "fixed",
              left: remoteUser.x,
              top: remoteUser.y,
              transform: "translate(-2px, -2px)",
              pointerEvents: "none",
              zIndex: 99999,
              transition: "left 0.08s ease-out, top 0.08s ease-out",
            }}
            className="flex flex-col gap-1 items-start"
          >
            {/* Custom SVG Mouse Pointer */}
            <svg
              className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                fill={remoteUser.color}
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            {/* User Name Tag overlay */}
            <span
              style={{ backgroundColor: remoteUser.color }}
              className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-md select-none pointer-events-none"
            >
              {remoteUser.name}
            </span>
          </div>
        ))}
    </>
  );
};
