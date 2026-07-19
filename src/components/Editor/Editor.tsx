import { useEffect, useMemo } from "react";
import { UsernameDialog } from "./UsernameDialog";
import RoomFullDialog from "./RoomFullDialog";
import { useLiveCursor } from "@/features/cursor/hooks/useLiveCursor";
import { RemoteCursors } from "@/features/cursor/components/RemoteCursors";
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
import { useEditor, useGridPattern } from "@/hooks/editor/useEditor";
import { useWindowSize } from "@/hooks/utility/utility";
import { cn } from "@/lib/utils";
import ZoomInOut from "./ZoomInOut";
import { KonvaEventObject } from "konva/lib/Node";
import UploadingImagesLoader from "./UploadingImagesLoader";
import { useUserStore } from "@/stores/useUserStore";
import { useRoomId } from "@/features/room/hooks/useRoomId";
import { socketInstance as socket} from "@/features/cursor/services";

function Editor() {
  const [viewportWidth, viewportHeight] = useWindowSize();
  const gridPattern = useGridPattern(50);

  const roomId = useRoomId();
  const { username, userId } = useUserStore((state) => state);
  const user = useMemo(() => {
    if (username && userId) {
      return { name: username, id: userId };
    }
    return null;
  }, [username, userId]);

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
    setImages,
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
    isUploadingImage,
  } = useEditor(socket, viewportWidth, viewportHeight, roomId);

  useLiveCursor(user);

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

  const onStagePointerDown = (e: KonvaEventObject<PointerEvent>) => {
    if (document.activeElement instanceof HTMLTextAreaElement) {
      document.activeElement.blur();
    }

    const clickedOnEmpty =
      e.target === e.target.getStage() || e.target.id() === "bg";

    if (clickedOnEmpty) {
      transformRef.current?.nodes([]);
      onpointerdown();
    }
  };

  useEffect(() => {
    const onConnect = () => {
      if (!user?.id) return;
      socket.emit("join-room", roomId);
    };

    socket.on("connect", onConnect);

    if (socket.connected) {
      onConnect();
    }

    socket.on("user-joined", () => {
      console.log("user joined");
    });

    ()=>{
       socket.off("connect")
       socket.off("user-joined")
    }
  }, [user, roomId]);

  useEffect(() => {
   
    socket.on("onrectangle", (rect: RectangleType) => {
      setRectangles((prev) => {
        const index = prev.findIndex((r) => r.id === rect.id);
        if (index > -1) {
          const updated = [...prev];
          updated[index] = rect;
          return updated;
        }
        return [...prev, rect];
      });
    });

    socket.on(
      "rect-update",
      (data: { id: string; props: Partial<RectangleType> }) => {
        setRectangles((prev) =>
          prev.map((r) => (r.id === data.id ? { ...r, ...data.props } : r)),
        );
      },
    );

    socket.on("oncircle", (circle: CircleType) => {
      setCircles((prev) => {
        const index = prev.findIndex((c) => c.id === circle.id);
        if (index > -1) {
          const updated = [...prev];
          updated[index] = circle;
          return updated;
        }
        return [...prev, circle];
      });
    });

    socket.on(
      "circle-update",
      (data: { id: string; props: Partial<CircleType> }) => {
        setCircles((prev) =>
          prev.map((c) => (c.id === data.id ? { ...c, ...data.props } : c)),
        );
      },
    );

    socket.on("onarrow", (arrow: ArrowType) => {
      setArrows((prev) => {
        const index = prev.findIndex((a) => a.id === arrow.id);
        if (index > -1) {
          const updated = [...prev];
          updated[index] = arrow;
          return updated;
        }
        return [...prev, arrow];
      });
    });

    socket.on(
      "arrow-update",
      (data: { id: string; props: Partial<ArrowType> }) => {
        setArrows((prev) =>
          prev.map((a) => (a.id === data.id ? { ...a, ...data.props } : a)),
        );
      },
    );

    socket.on("onscribble", (scribble: ScribbleType) => {
      setScribble((prev) => {
        const index = prev.findIndex((s) => s.id === scribble.id);
        if (index > -1) {
          const updated = [...prev];
          updated[index] = scribble;
          return updated;
        }
        return [...prev, scribble];
      });
    });

    socket.on(
      "scribble-update",
      (data: { id: string; props: Partial<ScribbleType> }) => {
        setScribble((prev) =>
          prev.map((s) => (s.id === data.id ? { ...s, ...data.props } : s)),
        );
      },
    );

    socket.on(
      "image-update",
      (data: { id: string; props: Record<string, any> }) => {
        setImages((prev) =>
          prev.map((i) => (i.id === data.id ? { ...i, ...data.props } : i)),
        );
      },
    );

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

    return () => {
      socket.off("connect");
      socket.off("onrectangle");
      socket.off("rect-update");
      socket.off("oncircle");
      socket.off("circle-update");
      socket.off("onarrow");
      socket.off("arrow-update");
      socket.off("onscribble");
      socket.off("scribble-update");
      socket.off("image-update");
      socket.off("ontext");
    };
  }, [
    setRectangles,
    setCircles,
    setArrows,
    setScribble,
    setImages,
    setTextList,
  ]);

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
                    onDragEnd={(e) => {
                      const props = { x: e.target.x(), y: e.target.y() };
                      updateShape("rectangle", rec.id, props);
                      socket.emit("rect-update", { roomId, id: rec.id, props });
                    }}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const props = {
                        x: node.x(),
                        y: node.y(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                        rotation: node.rotation(),
                      };
                      updateShape("rectangle", rec.id, props);
                      socket.emit("rect-update", { roomId, id: rec.id, props });
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
                    onDragEnd={(e) => {
                      const props = { x: e.target.x(), y: e.target.y() };
                      updateShape("circle", cir.id, props);
                      socket.emit("circle-update", {
                        roomId,
                        id: cir.id,
                        props,
                      });
                    }}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const props = {
                        x: node.x(),
                        y: node.y(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                        rotation: node.rotation(),
                      };
                      updateShape("circle", cir.id, props);
                      socket.emit("circle-update", {
                        roomId,
                        id: cir.id,
                        props,
                      });
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
                    onDragEnd={(e) => {
                      const props = { x: e.target.x(), y: e.target.y() };
                      updateShape("arrow", arrow.id, props);
                      socket.emit("arrow-update", {
                        roomId,
                        id: arrow.id,
                        props,
                      });
                    }}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const props = {
                        x: node.x(),
                        y: node.y(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                        rotation: node.rotation(),
                      };
                      updateShape("arrow", arrow.id, props);
                      socket.emit("arrow-update", {
                        roomId,
                        id: arrow.id,
                        props,
                      });
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
                    onDragEnd={(e) => {
                      const props = { x: e.target.x(), y: e.target.y() };
                      updateShape("scribble", scribble.id, props);
                      socket.emit("scribble-update", {
                        roomId,
                        id: scribble.id,
                        props,
                      });
                    }}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const props = {
                        x: node.x(),
                        y: node.y(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                        rotation: node.rotation(),
                      };
                      updateShape("scribble", scribble.id, props);
                      socket.emit("scribble-update", {
                        roomId,
                        id: scribble.id,
                        props,
                      });
                    }}
                  />
                ))}
                {images.map((image) => (
                  <URLImage
                    key={image.id}
                    image={image}
                    onclick={onclick}
                    onDragEnd={(e: any) => {
                      const props = { x: e.target.x(), y: e.target.y() };
                      updateShape("image", image.id, props);
                      socket.emit("image-update", {
                        roomId,
                        id: image.id,
                        props,
                      });
                    }}
                    onTransformEnd={(e: any) => {
                      const node = e.target;
                      const props = {
                        x: node.x(),
                        y: node.y(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                        rotation: node.rotation(),
                      };
                      updateShape("image", image.id, props);
                      socket.emit("image-update", {
                        roomId,
                        id: image.id,
                        props,
                      });
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
                      socket.emit("text", {
                        roomId,
                        textItem: { ...textItem, text: newText },
                      });
                    }}
                    onPositionChange={(x, y) => {
                      handleTextUpdate(textItem.id, { x, y });
                      socket.emit("text", {
                        roomId,
                        textItem: { ...textItem, x, y },
                      });
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
                      socket.emit("text", {
                        roomId,
                        textItem: { ...textItem, ...newProps },
                      });
                    }}
                  />
                ))}
                <Transformer ref={transformRef} />
              </Group>
            </Layer>
          </Stage>
          <ZoomInOut groupScale={groupScale} zoom={zoom} />
          <UploadingImagesLoader isUploadingImage={isUploadingImage} />
          <RemoteCursors />
        </section>
      </SidebarProvider>
      <UsernameDialog />
      <RoomFullDialog socket={socket} />
    </TooltipProvider>
  );
}

export default Editor;
