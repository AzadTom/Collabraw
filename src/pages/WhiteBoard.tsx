import ChatRoom from "@/components/ChatRoom";
import Editor from "@/components/Editor/Editor";
import User from "@/components/Editor/User";


const WhiteBoard = () => {
  return (
    <>
      <Editor />
      <ChatRoom />
      <User/>
    </>
  );
};

export default WhiteBoard;
