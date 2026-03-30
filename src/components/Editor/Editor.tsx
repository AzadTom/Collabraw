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
import URLImage from "./URLImage";
import TextNode from "./TextNode";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EditorSidebar } from "./EditorSidebar";
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
    editingTextId,
    setEditingTextId,
    setTextList,
    handleDrop,
    handleDragOver,
    updateShape,
    handleTextUpdate,
    handleTextRemove,
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
    if (document.activeElement instanceof HTMLTextAreaElement) {
      document.activeElement.blur();
    }

    const clickedOnEmpty =
      e.target === e.target.getStage() ||
      e.target.id() === "bg";

    if (clickedOnEmpty) {
      transformRef.current?.nodes([]);
      onpointerdown();
    }
  };

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={false}>
        <EditorSidebar controlProps={controlProps} />
        <section
          className="relative w-full h-full"
          style={{
            touchAction: "none",
            overscrollBehavior: "none",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="absolute top-4 left-4 z-50 bg-background/80 backdrop-blur rounded-md shadow-sm border">
            <SidebarTrigger className="p-2" />
          </div>
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
                    scaleX={rec.scaleX || 1}
                    scaleY={rec.scaleY || 1}
                    rotation={rec.rotation || 0}
                    fill={isDark ? "#f7f7f7" : "#1e1e1e"}
                    width={rec.width}
                    height={rec.height}
                    draggable
                    onClick={onclick}
                    onDragEnd={(e) => updateShape("rectangle", rec.id, { x: e.target.x(), y: e.target.y() })}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      updateShape("rectangle", rec.id, { x: node.x(), y: node.y(), scaleX: node.scaleX(), scaleY: node.scaleY(), rotation: node.rotation() });
                    }}
                  />
                ))}
                {circles.map((cir) => (
                  <Circle
                    key={cir.id}
                    x={cir.x}
                    y={cir.y}
                    scaleX={cir.scaleX || 1}
                    scaleY={cir.scaleY || 1}
                    rotation={cir.rotation || 0}
                    radius={cir.radius}
                    fill={isDark ? "#f7f7f7" : "#1e1e1e"}
                    draggable
                    onClick={onclick}
                    onDragEnd={(e) => updateShape("circle", cir.id, { x: e.target.x(), y: e.target.y() })}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      updateShape("circle", cir.id, { x: node.x(), y: node.y(), scaleX: node.scaleX(), scaleY: node.scaleY(), rotation: node.rotation() });
                    }}
                  />
                ))}
                {arrows.map((arrow) => (
                  <Arrow
                    key={arrow.id}
                    x={arrow.x || 0}
                    y={arrow.y || 0}
                    scaleX={arrow.scaleX || 1}
                    scaleY={arrow.scaleY || 1}
                    rotation={arrow.rotation || 0}
                    points={arrow.points}
                    stroke={isDark ? "#f7f7f7" : "#1e1e1e"}
                    strokeWidth={2}
                    fill={isDark ? "#f7f7f7" : "#1e1e1e"}
                    draggable
                    onClick={onclick}
                    onDragEnd={(e) => updateShape("arrow", arrow.id, { x: e.target.x(), y: e.target.y() })}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      updateShape("arrow", arrow.id, { x: node.x(), y: node.y(), scaleX: node.scaleX(), scaleY: node.scaleY(), rotation: node.rotation() });
                    }}
                  />
                ))}
                {scribbles.map((scribble) => (
                  <Line
                    key={scribble.id}
                    x={scribble.x || 0}
                    y={scribble.y || 0}
                    scaleX={scribble.scaleX || 1}
                    scaleY={scribble.scaleY || 1}
                    rotation={scribble.rotation || 0}
                    points={scribble.points}
                    stroke={isDark ? "#f7f7f7" : "#1e1e1e"}
                    strokeWidth={2}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    draggable
                    onClick={onclick}
                    hitStrokeWidth={10}
                    onDragEnd={(e) => updateShape("scribble", scribble.id, { x: e.target.x(), y: e.target.y() })}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      updateShape("scribble", scribble.id, { x: node.x(), y: node.y(), scaleX: node.scaleX(), scaleY: node.scaleY(), rotation: node.rotation() });
                    }}
                  />
                ))}
                {images.map((image) => (
                  <URLImage
                    key={image.id}
                    image={image}
                    onclick={onclick}
                    onDragEnd={(e: any) => updateShape("image", image.id, { x: e.target.x(), y: e.target.y() })}
                    onTransformEnd={(e: any) => {
                      const node = e.target;
                      updateShape("image", image.id, { x: node.x(), y: node.y(), scaleX: node.scaleX(), scaleY: node.scaleY(), rotation: node.rotation() });
                    }}
                  />
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
                      handleTextUpdate(textItem.id, { text: newText });
                      socket.emit("text", { ...textItem, text: newText });
                    }}
                    onPositionChange={(x, y) => {
                      handleTextUpdate(textItem.id, { x, y });
                      socket.emit("text", { ...textItem, x, y });
                    }}
                    onBlur={() => {
                      setEditingTextId(null);
                      if (!textItem.text.trim()) {
                        handleTextRemove(textItem.id);
                      }
                    }}
                    onSelect={onclick}
                    onTransformEnd={(newProps: any) => {
                      handleTextUpdate(textItem.id, newProps);
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
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default Editor;
