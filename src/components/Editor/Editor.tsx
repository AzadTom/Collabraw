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
import URLImage from "./URLImage";
import TextNode from "./TextNode";
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
import ZoomInOut from "./ZoomInOut";
import { KonvaEventObject } from "konva/lib/Node";

const socket = io("https://white-board-backend-socket.vercel.app/");

function Editor() {
  const [viewportWidth, viewportHeight] = useWindowSize();
  const gridPattern = useGridPattern(50);
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    mainGroupRef,
    stageRef,
    groupScale,
    handleWheel,
    groupStagePos,
    zoom,
    images,
    transformRef,
    onclick,
    shapeControls,
    controlProps,
    isDark,
    pointerProps,
    cursor,
    textList,
    updateText,
    removeText,
    editingTextId,
    setEditingTextId,
    setTextList,
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

    socket.on("ontext", (textItem) => {
      setTextList((prev) => {
        const index = prev.findIndex((t) => t.id === textItem.id);
        if (index > -1) {
          const newTexts = [...prev];
          newTexts[index] = textItem;
          return newTexts;
        }
        return [...prev, textItem];
      });
    });
  }, [
    rectangles,
    circles,
    arrows,
    scribbles,
    textList,
    setRectangles,
    setCircles,
    setArrows,
    setScribble,
    setTextList,
  ]);

  const onStagePointerDown = (e: KonvaEventObject<PointerEvent>) => {
    const clickedOnEmpty =
      e.target === e.target.getStage() ||
      e.target.id() === "bg";

    if (clickedOnEmpty) {
      transformRef.current?.nodes([]);
      onpointerdown();
    }
  };

  return (
    <section className="relative" style={{
      touchAction: "none",
      overscrollBehavior: "none",
    }}>
      <Controls {...controlProps} />
      <Stage
        ref={stageRef}
        width={viewportWidth}
        height={viewportHeight}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={onStagePointerDown}
        onPointerMove={onpointermove}
        onPointerUp={onpointerup}
        onPointerCancel={onpointerup}
        style={{ cursor }}
        className={cn(isDark ? "bg-[#1e1e1e]" : "bg-[#f7f7f7]", "p-12")}
      >
        <Layer>
          <Group
            ref={mainGroupRef}
            scaleX={groupScale}
            scaleY={groupScale}
            x={groupStagePos.x}
            y={groupStagePos.y}
          >
            <Rect
              id="bg"
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
                fill={isDark ? "#f7f7f7" : "#1e1e1e"}
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
                fill={isDark ? "#f7f7f7" : "#1e1e1e"}
                draggable
                onClick={onclick}
              />
            ))}
            {arrows.map((arrow) => (
              <Arrow
                key={arrow.id}
                points={arrow.points}
                stroke={isDark ? "#f7f7f7" : "#1e1e1e"}
                strokeWidth={2}
                fill={isDark ? "#f7f7f7" : "#1e1e1e"}
                draggable
                onClick={onclick}
              />
            ))}
            {scribbles.map((scribble) => (
              <Line
                key={scribble.id}
                points={scribble.points}
                stroke={isDark ? "#f7f7f7" : "#1e1e1e"}
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
            {textList.map((textItem) => (
              <TextNode
                key={textItem.id}
                shape={textItem}
                isEditing={editingTextId === textItem.id}
                onEditStart={() => {
                  setEditingTextId(textItem.id);
                  transformRef.current?.nodes([]);
                }}
                onChange={(newText) => {
                  updateText(textItem.id, { text: newText });
                  socket.emit("text", { ...textItem, text: newText });
                }}
                onPositionChange={(x, y) => {
                  updateText(textItem.id, { x, y });
                  socket.emit("text", { ...textItem, x, y });
                }}
                onBlur={() => {
                  setEditingTextId(null);
                  if (!textItem.text.trim()) {
                    removeText(textItem.id);
                  }
                }}
                onSelect={onclick}
                onTransformEnd={(newProps: any) => {
                  updateText(textItem.id, newProps);
                  socket.emit("text", { ...textItem, ...newProps });
                }}
              />
            ))}
            <Transformer ref={transformRef} />
          </Group>
        </Layer>
      </Stage>
      <ZoomInOut groupScale={groupScale} zoom={zoom} />
    </section>
  );
}

export default Editor;
