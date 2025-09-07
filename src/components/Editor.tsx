import { useEffect } from "react";
import { Arrow, Circle, Layer, Line, Rect, Stage, Transformer } from "react-konva";
import Controls, { ZoomInOut } from "./Controls";
import { ACTIONS } from "../utils/constant";
import URLImage from "./URLImage";
import { ArrowType, RectangleType, ScribbleType, CircleType } from "../types/PainTypes";
import { io } from 'socket.io-client';
import { useTheme } from "./ThemeProvider/ThemeProvider";
import { useEditor, useZoomInOut } from "@/hooks/editor/useEditor";

const socket = io('https://white-board-backend-socket.vercel.app/');

function Editor() {

  const { isDark } = useTheme();
  const { stageRef, stagePos, action, arrows,
    circles, fillcolor, images, rectangles,
    scribbles, setArrows, setCircles,
    setRectangles, setScribble, transformRef,
    onclick, onpointermove, onpointerup, onpointerdown, controlProps } = useEditor(socket);
  const { zoom, handleZoomIn, handleZoomOut, } = useZoomInOut();

  useEffect(() => {

    socket.on('server-ready', () => {

      console.log("connected!");

    });


    socket.on('onrectangle', (rect: RectangleType) => {

      if (rectangles.includes(rect)) return;
      setRectangles((prev) => [...prev, rect]);

    });



    socket.on('oncircle', (circle: CircleType) => {

      if (circles.includes(circle)) return;
      setCircles((prev) => [...prev, circle]);

    });

    socket.on('onarrow', (arrow: ArrowType) => {

      if (arrows.includes(arrow)) return;
      setArrows((prev) => [...prev, arrow]);

    });


    socket.on('onscribble', (scribble: ScribbleType) => {

      if (scribbles.includes(scribble)) return;
      setScribble((prev) => [...prev, scribble]);

    });




  }, [stageRef])


  return (
    <>
      <section className="relative">
        <Controls {...controlProps} />
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          scaleX={zoom}
          scaleY={zoom}
          x={stagePos.x}
          y={stagePos.y}
          onPointerDown={onpointerdown}
          onPointerMove={onpointermove}
          onPointerUp={onpointerup}
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              width={window.innerWidth}
              height={window.innerHeight}
              fill={isDark ? "#000000" : "#f5f5f5"}
              id="bg"
              onClick={() => {
                transformRef?.current?.nodes([]);
              }}
            />
            {rectangles.map((rec) => (
              <Rect
                key={rec.id}
                x={rec.x}
                y={rec.y}
                fill={rec.fillcolor}
                width={rec.width}
                height={rec.height}
                draggable={action === ACTIONS.SELECT} // ✅ Only draggable in select mode
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
                draggable={action === ACTIONS.SELECT}
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
                draggable={action === ACTIONS.SELECT}
                onClick={onclick}
              />
            ))}
            {scribbles.map((scribble) => (
              <Line
                key={scribble.id}
                points={scribble.points}
                fill={scribble.fillcolor}
                tension={0.5}
                stroke={fillcolor}
                strokeWidth={2}
                lineCap="round"
                lineJoin="round"
                draggable={action === ACTIONS.SELECT}
              />
            ))}
            {images.map((image, index) => (
              <URLImage key={index * 3} image={image} onclick={onclick} />
            ))}
            <Transformer ref={transformRef} />
          </Layer>
        </Stage>
        <ZoomInOut zoom={zoom} handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
      </section>
    </>
  )
}

export default Editor;