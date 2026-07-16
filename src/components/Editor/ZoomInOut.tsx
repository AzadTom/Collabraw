import { Minus, Plus } from "lucide-react";

const ZoomInOut = ({groupScale,zoom}:{groupScale:number,zoom:(factor: number, type: string) => void}) => {

  return (
    <div
     className="bottom-4 left-4 border border-[#363636] bg-[#262626]"
      style={{
        position: "absolute",
        color: "white",
        padding: "8px 4px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <button
        onClick={() => zoom(0.1, "plus")}
        style={{ padding: "4px 8px", borderRadius: "4px" }}
      >
        <Plus/>
      </button>
      <span>{Math.round(groupScale * 100)}%</span>
      <button
        onClick={() => zoom(0.1, "minus")}
        style={{ padding: "4px 8px", borderRadius: "4px" }}
      >
        <Minus/>
      </button>
    </div>
  )
}

export default ZoomInOut;