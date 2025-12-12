import { useTheme } from "@/components/ThemeProvider/ThemeProvider";
import {
  ArrowType,
  CircleType,
  ImageType,
  RectangleType,
  ScribbleType,
} from "@/types/PainTypes";
import { ACTIONS } from "@/utils/constant";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import Konva from "konva";
import { Group } from "konva/lib/Group";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { v4 as uuid } from "uuid";

export const useEditor = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  viewportWidth: number,
  viewportHeight: number
) => {

  const { isDark } = useTheme();

  const stageRef = useRef<Konva.Stage>(null);
  const mainGroupRef = useRef<Konva.Group>(null);
  const [groupScale, setGroupScale] = useState<number>(1);
  const [groupStagePos, setGroupStagePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });


  const [action, setAction] = useState<string>(ACTIONS.SELECT);
  const [fillcolor, setFillColor] = useState<string>(
    isDark ? "#ffffff" : "#000000"
  );

  const currentShapeId = useRef<any>(null);
  const isPainting = useRef<boolean>(false);
  const transformRef = useRef<any>(null);
  const [images, setImages] = useState<ImageType[]>([]);
  const [rectangles, setRectangles] = useState<RectangleType[]>([]);
  const [circles, setCircles] = useState<CircleType[]>([]);
  const [arrows, setArrows] = useState<ArrowType[]>([]);
  const [scribbles, setScribble] = useState<ScribbleType[]>([]);


  const { zoom, handleWheel, handleExport, handleFileChange, onclick } = useOtherFunctionForEditor(viewportWidth, viewportHeight, mainGroupRef, setGroupScale, setGroupStagePos, stageRef, transformRef, setImages);


  const onpointerdown = () => {

    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current;
    const group = mainGroupRef.current;
    if (!stage || !group) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const scale = group.scaleX();

    const x = (pointer.x - group.x()) / scale;
    const y = (pointer.y - group.y()) / scale;

    const id = uuid();
    currentShapeId.current = id;
    isPainting.current = true;

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rects: RectangleType[]) => [
          ...rects,
          {
            id,
            x,
            y,
            width: 20,
            height: 20,
            fillcolor,
          },
        ]);

        const rect: RectangleType = {
          id,
          x,
          y,
          width: 20,
          height: 20,
          fillcolor,
        };
        socket.emit("rectangle", rect);
        break;

      case ACTIONS.CIRCLE:
        setCircles((circles: CircleType[]) => [
          ...circles,
          {
            id,
            x,
            y,
            radius: 20,
            fillcolor,
          },
        ]);
        const circle = { id, x, y, radius: 20, fillcolor };
        socket.emit("circle", circle);
        break;

      case ACTIONS.ARROW:
        setArrows((arrows: ArrowType[]) => [
          ...arrows,
          {
            id,
            points: [x, y, x + 20, y + 20],
            fillcolor,
          },
        ]);
        const arrow = { id, points: [x, y, x + 20, y + 20], fillcolor };
        socket.emit("arrow", arrow);
        break;

      case ACTIONS.SCRIBBLE:
        setScribble((scribbles: ScribbleType[]) => [
          ...scribbles,
          {
            id,
            points: [x, y],
            fillcolor,
          },
        ]);
        const scribble = { id, points: [x, y], fillcolor };
        socket.emit("scribble", scribble);
        break;
    }
  };

  const onpointermove = () => {
    if (action === ACTIONS.SELECT || !isPainting.current) return;

    const stage = stageRef.current;
    const group = mainGroupRef.current;
    if (!stage || !group) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const scale = group.scaleX();

    const x = (pointer.x - group.x()) / scale;
    const y = (pointer.y - group.y()) / scale;

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rects: RectangleType[]) =>
          rects.map((rec: RectangleType) => {
            if (rec.id === currentShapeId.current) {
              const rect: RectangleType = {
                ...rec,
                width: x - rec.x,
                height: y - rec.y,
              };
              socket.emit("rectangle", rect);

              return {
                ...rec,
                width: x - rec.x,
                height: y - rec.y,
              };
            }
            return rec;
          })
        );
        break;

      case ACTIONS.CIRCLE:
        setCircles((circles) =>
          circles.map((cir) => {
            if (cir.id === currentShapeId.current) {
              const circle: CircleType = {
                ...cir,
                radius: ((y - cir.y) ** 2 + (x - cir.y) ** 2) ** 0.5,
              };
              socket.emit("circle", circle);

              return {
                ...cir,
                radius: ((y - cir.y) ** 2 + (x - cir.y) ** 2) ** 0.5,
              };
            }
            return cir;
          })
        );
        break;

      case ACTIONS.ARROW:
        setArrows((arrows: ArrowType[]) =>
          arrows.map((arrow: ArrowType) => {
            if (arrow.id === currentShapeId.current) {
              const arrowshape: ArrowType = {
                ...arrow,
                points: [arrow.points[0], arrow.points[1], x, y],
                fillcolor: fillcolor,
              };
              socket.emit("arrow", arrowshape);

              return {
                ...arrow,
                points: [arrow.points[0], arrow.points[1], x, y],
                fillcolor: fillcolor,
              };
            }
            return arrow;
          })
        );
        break;
      case ACTIONS.SCRIBBLE:
        setScribble((scribbles: ScribbleType[]) =>
          scribbles.map((scribble) => {
            if (scribble.id === currentShapeId.current) {
              const scribbleshape: ArrowType = {
                ...scribble,
                points: [...scribble.points, x, y],
              };
              socket.emit("scribble", scribbleshape);

              return {
                ...scribble,
                points: [...scribble.points, x, y],
              };
            }
            return scribble;
          })
        );
        break;
    }
  };

  const onpointerup = () => {
    isPainting.current = false;
  };

  const controlProps = {
    handleExport,
    action,
    setAction,
    fillcolor,
    setFillColor,
    handleFileChange,
    isDark,
  };

  const pointerProps = {
    onpointerdown,
    onpointerup,
    onpointermove,
  };

  const shapeControls = {
    arrows,
    setArrows,
    rectangles,
    setRectangles,
    scribbles,
    setScribble,
    circles,
    setCircles,
  };

  return {
    mainGroupRef,
    stageRef,
    groupStagePos,
    groupScale,
    action,
    setAction,
    fillcolor,
    setFillColor,
    currentShapeId,
    isPainting,
    transformRef,
    images,
    setImages,
    rectangles,
    setRectangles,
    circles,
    setCircles,
    arrows,
    setArrows,
    scribbles,
    setScribble,
    handleExport,
    handleFileChange,
    onclick,
    isDark,
    shapeControls,
    controlProps,
    zoom,
    handleWheel,
    pointerProps,
  };
};

const useOtherFunctionForEditor = (viewportWidth: number, viewportHeight: number, mainGroupRef: React.RefObject<Group>, setGroupScale: Dispatch<SetStateAction<number>>, setGroupStagePos: Dispatch<SetStateAction<{
  x: number;
  y: number;
}>>, stageRef: React.RefObject<Stage>, transformRef: React.MutableRefObject<any>, setImages: Dispatch<SetStateAction<ImageType[]>>) => {


  const onclick = (e: KonvaEventObject<MouseEvent>) => {
    const target = e.currentTarget;
    transformRef?.current?.nodes([target]);
  };

  const handleExport = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files);

      handleFilesChange(fileArray);
    }
  };

  const handleFilesChange = (files: File[]) => {
    const filesArray = files.map((file) => {
      const url = URL.createObjectURL(file);

      return { src: url, x: 0, y: 0 };
    });
    setImages((images) => [...images, ...filesArray]);
  };


  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {

    e.evt.preventDefault();

    const stage = stageRef.current;
    const group = mainGroupRef.current;
    if (!stage || !group) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    if (e.evt.ctrlKey || e.evt.metaKey) {
      // ---- Zoom ----
      const scaleBy = 1.05;
      const oldScale = group.scaleX();

      const mousePointTo = {
        x: (pointer.x - group.x()) / oldScale,
        y: (pointer.y - group.y()) / oldScale,
      };

      const direction = e.evt.deltaY > 0 ? -1 : 1;
      let newScale =
        direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      // clamp scale
      const MIN = 0.1;
      const MAX = 1;

      const clampedScale = Math.max(MIN, Math.min(MAX, newScale));

      // if scale didn't change, don't adjust position (fixes jitter)
      if (clampedScale === oldScale) return;

      setGroupScale(clampedScale);

      // adjust position to keep zoom centered
      setGroupStagePos({
        x: pointer.x - mousePointTo.x * clampedScale,
        y: pointer.y - mousePointTo.y * clampedScale,
      });

    } else {
      // ---- Pan ----
      setGroupStagePos((prev) => ({
        x: prev.x - e.evt.deltaX,
        y: prev.y - e.evt.deltaY,
      }));
    }
  };



  const zoom = (factor: number, type: String) => {
    const groupRef = mainGroupRef.current;
    if (!groupRef) return;

    const oldScale = groupRef.scaleX();
    let newScale = oldScale;
    if (type === "plus") {
      const value = oldScale + factor;
      if (value <= 1) {
        newScale = value;
      }
    }

    if (type === "minus") {
      const value = oldScale - factor;
      if (value >= 0.1) {
        newScale = oldScale - factor;
      }
    }

    setGroupScale(newScale);

    const center = { x: viewportWidth / 2, y: viewportHeight / 2 };
    const mousePointTo = {
      x: (center.x - groupRef.x()) / oldScale,
      y: (center.y - groupRef.y()) / oldScale,
    };

    setGroupStagePos({
      x: center.x - mousePointTo.x * newScale,
      y: center.y - mousePointTo.y * newScale,
    });
  };

  return {
    zoom,
    handleWheel,
    handleExport,
    onclick,
    handleFileChange,
  }
}

export const useGridPattern = (gridSize: number, stroke = "#333") => {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = gridSize;
    canvas.height = gridSize;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gridSize, 0);
      ctx.lineTo(gridSize, gridSize);
      ctx.lineTo(0, gridSize);
      ctx.stroke();
    }
    const img = new Image();
    img.src = canvas.toDataURL("image/png");
    return img;
  }, [gridSize, stroke]);
};

export const useZoomInOut = () => {
  const [zoom, setZoom] = useState(1);
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 1));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.01));

  return {
    zoom,
    setZoom,
    handleZoomIn,
    handleZoomOut,
  };
};
