const ZoomInOut = ({groupScale,zoom}:{groupScale:number,zoom:(factor: number, type: String) => void}) => {

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        background: "rgba(0,0,0,0.6)",
        color: "white",
        padding: "8px 12px",
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
        ➕
      </button>
      <span>{Math.round(groupScale * 100)}%</span>
      <button
        onClick={() => zoom(0.1, "minus")}
        style={{ padding: "4px 8px", borderRadius: "4px" }}
      >
        ➖
      </button>
    </div>
  )
}

export default ZoomInOut;