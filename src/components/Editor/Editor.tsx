import { useEffect } from "react";
import {
  Arrow,
  Circle,
  Group,
  Layer,
  Line,
  Rect,
  Stage,
  Transformer,
} from "react-konva";
import Controls from "./Controls";
import { ACTIONS } from "../../utils/constant";
import URLImage from "./URLImage";
import {
  ArrowType,
  RectangleType,
  ScribbleType,
  CircleType,
} from "../../types/PainTypes";
import { io } from "socket.io-client";
import { useEditor, useGridPattern } from "@/hooks/editor/useEditor";
import { useWindowSize } from "@/hooks/utility/utility";
import { cn } from "@/lib/utils";

const socket = io("https://white-board-backend-socket.vercel.app/");

function Editor() {
  const [viewportWidth, viewportHeight] = useWindowSize();
  const gridPattern = useGridPattern(50);
  const {
    mainGroupRef,
    stageRef,
    stagePos,
    groupStagePos,
    stageScale,
    groupScale,
    handleWheel,
    zoom,
    action,
    fillcolor,
    images,
    transformRef,
    onclick,
    shapeControls,
    controlProps,
    isDark,
    pointerProps,
  } = useEditor(socket, viewportWidth, viewportHeight);

  const {
    arrows,
    setArrows,
    circles,
    setCircles,
    rectangles,
    setRectangles,
    scribbles,
    setScribble,
  } = shapeControls;
  const { onpointerdown, onpointerup, onpointermove } = pointerProps;

  useEffect(() => {
    socket.on("server-ready", () => {
      console.log("connected!");
    });

    socket.on("onrectangle", (rect: RectangleType) => {
      if (!rectangles.includes(rect)) {
        setRectangles((prev) => [...prev, rect]);
      }
    });

    socket.on("oncircle", (circle: CircleType) => {
      if (!circles.includes(circle)) {
        setCircles((prev) => [...prev, circle]);
      }
    });

    socket.on("onarrow", (arrow: ArrowType) => {
      if (!arrows.includes(arrow)) {
        setArrows((prev) => [...prev, arrow]);
      }
    });

    socket.on("onscribble", (scribble: ScribbleType) => {
      if (!scribbles.includes(scribble)) {
        setScribble((prev) => [...prev, scribble]);
      }
    });
  }, [
    rectangles,
    circles,
    arrows,
    scribbles,
    setRectangles,
    setCircles,
    setArrows,
    setScribble,
  ]);

  return (
    <section className="relative">
      <Controls {...controlProps} />
      <Stage 
        ref={stageRef}
        width={viewportWidth}
        height={viewportHeight}
        onWheel={handleWheel}
        onPointerDown={onpointerdown}
        onPointerMove={onpointermove}
        onPointerUp={onpointerup}
        className={cn(isDark ? "bg-[#1e1e1e]" : "bg-[#f7f7f7]", "p-12")}
      >
        {/* Infinite Grid Background */}
        <Layer>
          <Group
            ref={mainGroupRef}
            scaleX={groupScale}
            scaleY={groupScale}
            x={groupStagePos.x}
            y={groupStagePos.y}
          >
            <Rect
              x={-100000}
              y={-100000}
              width={200000}
              height={200000}
              fillPatternImage={gridPattern}
              fillPatternRepeat="repeat"
            />
            {rectangles.map((rec) => (
              <Rect
                key={rec.id}
                x={rec.x}
                y={rec.y}
                fill={rec.fillcolor}
                width={rec.width}
                height={rec.height}
                draggable
                onClick={onclick}
              />
            ))}
            {circles.map((cir) => (
              <Circle
                key={cir.id}
                x={cir.x}
                y={cir.y}
                radius={cir.radius}
                fill={cir.fillcolor}
                draggable
                onClick={onclick}
              />
            ))}
            {arrows.map((arrow) => (
              <Arrow
                key={arrow.id}
                points={arrow.points}
                stroke={fillcolor}
                strokeWidth={2}
                fill={arrow.fillcolor}
                draggable
                onClick={onclick}
              />
            ))}
            {scribbles.map((scribble) => (
              <Line
                key={scribble.id}
                points={scribble.points}
                stroke={fillcolor}
                strokeWidth={2}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                draggable
              />
            ))}
            {images.map((image, index) => (
              <URLImage key={index} image={image} onclick={onclick} />
            ))}
            <Transformer ref={transformRef} />
          </Group>
        </Layer>
      </Stage>
      {/* Zoom controls */}
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
    </section>
  );
}

export default Editor;
