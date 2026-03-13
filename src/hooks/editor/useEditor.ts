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
import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

  const cursor = action === ACTIONS.TEXT ? 'crosshair' : 'default';
  const currentShapeId = useRef<any>(null);
  const isPainting = useRef<boolean>(false);
  const transformRef = useRef<any>(null);
  const [images, setImages] = useState<ImageType[]>([]);
  const [rectangles, setRectangles] = useState<RectangleType[]>([]);
  const [circles, setCircles] = useState<CircleType[]>([]);
  const [arrows, setArrows] = useState<ArrowType[]>([]);
  const [scribbles, setScribble] = useState<ScribbleType[]>([]);

  const lastTouchPos = useRef<{ x: number; y: number } | null>(null);
  const lastTouchDist = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);





  const {
    zoom,
    handleWheel,
    handleExport,
    handleFileChange,
    onclick,
    resetZoom,
  } = useOtherFunctionForEditor(
    viewportWidth,
    viewportHeight,
    mainGroupRef,
    setGroupScale,
    setGroupStagePos,
    stageRef,
    transformRef,
    setImages
  );

const handleTouchStart = (e: Konva.KonvaEventObject<TouchEvent>) => {
  e.evt.preventDefault();

  const stage = stageRef.current;
  if (!stage) return;

  stage.setPointersPositions(e.evt);

  if (e.evt.touches.length === 1) {
    // ONE finger → possible pan
    const t = e.evt.touches[0];
    lastTouchPos.current = { x: t.clientX, y: t.clientY };
  }

  if (e.evt.touches.length === 2) {
    // TWO fingers → zoom
    const [t1, t2] = e.evt.touches;
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;

    lastTouchDist.current = Math.hypot(dx, dy);
    lastTouchCenter.current = {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    };
  }
};




 const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => {
  e.evt.preventDefault();

  const stage = stageRef.current;
  const group = mainGroupRef.current;
  if (!stage || !group) return;

  stage.setPointersPositions(e.evt);

  /* ======================
     ONE FINGER → PAN
     (only in SELECT mode)
  ====================== */

  if (e.evt.touches.length === 1 && action === ACTIONS.SELECT) {
    const t = e.evt.touches[0];

    if (!lastTouchPos.current) {
      lastTouchPos.current = { x: t.clientX, y: t.clientY };
      return;
    }

    const dx = t.clientX - lastTouchPos.current.x;
    const dy = t.clientY - lastTouchPos.current.y;

    setGroupStagePos((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastTouchPos.current = { x: t.clientX, y: t.clientY };
  }

  /* ======================
     TWO FINGERS → ZOOM
  ====================== */

  if (e.evt.touches.length === 2) {
    const [t1, t2] = e.evt.touches;

    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    const dist = Math.hypot(dx, dy);

    const center = {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    };

    if (!lastTouchDist.current || !lastTouchCenter.current) {
      lastTouchDist.current = dist;
      lastTouchCenter.current = center;
      return;
    }

    const scaleBy = dist / lastTouchDist.current;
    const oldScale = group.scaleX();

    let newScale = oldScale * scaleBy;
    const MIN = 0.1;
    const MAX = 1;
    newScale = Math.max(MIN, Math.min(MAX, newScale));

    const mousePointTo = {
      x: (center.x - group.x()) / oldScale,
      y: (center.y - group.y()) / oldScale,
    };

    setGroupScale(newScale);
    setGroupStagePos({
      x: center.x - mousePointTo.x * newScale,
      y: center.y - mousePointTo.y * newScale,
    });

    lastTouchDist.current = dist;
    lastTouchCenter.current = center;
  }
};



const handleTouchEnd = () => {
  lastTouchPos.current = null;
  lastTouchDist.current = null;
  lastTouchCenter.current = null;
};





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
            width: 0,
            height: 0,
            fillcolor,
          },
        ]);

        const rect: RectangleType = {
          id,
          x,
          y,
          width: 0,
          height: 0,
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
            radius: 0,
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

  // Keyboard shortcuts for tools and zoom reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isInputLike =
        tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable;

      if (isInputLike) return;

      // Tool switching
      switch (e.key) {
        case "v":
        case "V":
          setAction(ACTIONS.SELECT);
          break;
        case "r":
        case "R":
          setAction(ACTIONS.RECTANGLE);
          break;
        case "c":
        case "C":
          setAction(ACTIONS.CIRCLE);
          break;
        case "p":
        case "P":
          setAction(ACTIONS.SCRIBBLE);
          break;
        case "a":
        case "A":
          setAction(ACTIONS.ARROW);
          break;
        default:
          break;
      }

      // Reset zoom with Ctrl/Cmd + 0
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setAction, resetZoom]);

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
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
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
    cursor,
  };
};

const useOtherFunctionForEditor = (
  viewportWidth: number,
  viewportHeight: number,
  mainGroupRef: RefObject<Group>,
  setGroupScale: Dispatch<SetStateAction<number>>,
  setGroupStagePos: Dispatch<
    SetStateAction<{
      x: number;
      y: number;
    }>
  >,
  stageRef: RefObject<Stage>,
  transformRef: MutableRefObject<any>,
  setImages: Dispatch<SetStateAction<ImageType[]>>
) => {


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

  const resetZoom = () => {
    const groupRef = mainGroupRef.current;
    if (!groupRef) return;

    setGroupScale(1);
    setGroupStagePos({
      x: 0,
      y: 0,
    });
  };

  return {
    zoom,
    handleWheel,
    handleExport,
    onclick,
    handleFileChange,
    resetZoom,
  };
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
