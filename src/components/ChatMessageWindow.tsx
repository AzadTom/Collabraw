const ChatMessageWindow = ({ onClose }: { onClose: () => void }) => {
  return (
    <>
      <div
        className="fixed  h-svh  right-0 top-0 bottom-0 bg-white z-50 max-w-[50%] w-full"
        onClick={onClose}
      >
        <div>
          <div title="Messages" className="text-black" />
        </div>
      </div>
    </>
  );
};

export default ChatMessageWindow;
