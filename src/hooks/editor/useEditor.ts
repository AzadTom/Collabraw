import { useTheme } from "@/components/ThemeProvider/ThemeProvider";
import { ArrowType, CircleType, ImageType, RectangleType, ScribbleType } from "@/types/PainTypes";
import { ACTIONS } from "@/utils/constant";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { v4 as uuid } from "uuid";

export const useEditor = (socket: Socket<DefaultEventsMap, DefaultEventsMap>) => {

    const { isDark } = useTheme();
    const stageRef = useRef<any>(null);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

    // controls
    const [action, setAction] = useState<string>(ACTIONS.SELECT);
    const [fillcolor, setFillColor] = useState<string>(isDark ? "#ffffff" : "#000000");
    const currentShapeId = useRef<any>(null);
    const isPainting = useRef<boolean>(false);
    const transformRef = useRef<any>(null);
    const [images, setImages] = useState<ImageType[]>([]);
    const [rectangles, setRectangles] = useState<RectangleType[]>([]);
    const [circles, setCircles] = useState<CircleType[]>([]);
    const [arrows, setArrows] = useState<ArrowType[]>([]);
    const [scribbles, setScribble] = useState<ScribbleType[]>([]);


    // handleExport 
    const handleExport = () => {

        const uri = stageRef.current.toDataURL();
        const link = document.createElement("a");
        link.download = "image.png";
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }


    // handle files
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
    }
    // end handle files


    const onclick = (e: KonvaEventObject<MouseEvent>) => {

        if (action !== ACTIONS.SELECT) return;

        const target = e.currentTarget;
        transformRef?.current?.nodes([target]);

    }




    // pointer up move down
    const onpointerdown = () => {
        if (action === ACTIONS.SELECT) return;

        const stage = stageRef.current;

        const { x, y } = stage.getPointerPosition();

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
                        fillcolor

                    },
                ]);


                const rect: RectangleType = { id, x, y, width: 20, height: 20, fillcolor };
                socket.emit('rectangle', rect);
                break;

            case ACTIONS.CIRCLE:
                setCircles((circles: CircleType[]) => [
                    ...circles,
                    {
                        id,
                        x,
                        y,
                        radius: 20,
                        fillcolor
                    }
                ]);
                const circle = { id, x, y, radius: 20, fillcolor };
                socket.emit('circle', circle);
                break;

            case ACTIONS.ARROW:

                setArrows((arrows: ArrowType[]) => [
                    ...arrows,
                    {
                        id,
                        points: [x, y, x + 20, y + 20],
                        fillcolor
                    }
                ]);
                const arrow = { id, points: [x, y, x + 20, y + 20], fillcolor };
                socket.emit('arrow', arrow);
                break;

            case ACTIONS.SCRIBBLE:
                setScribble((scribbles: ScribbleType[]) => [
                    ...scribbles,
                    {
                        id,
                        points: [x, y],
                        fillcolor
                    }
                ]);
                const scribble = { id, points: [x, y], fillcolor };
                socket.emit('scribble', scribble);
                break;



        }


    }


    const onpointermove = () => {

        if (action === ACTIONS.SELECT || !isPainting.current) return;
        const stage = stageRef.current;
        const { x, y } = stage.getPointerPosition();

        switch (action) {


            case ACTIONS.RECTANGLE:

                setRectangles((rects: RectangleType[]) => rects.map((rec: RectangleType) => {
                    if (rec.id === currentShapeId.current) {

                        const rect: RectangleType = { ...rec, width: x - rec.x, height: y - rec.y };
                        socket.emit('rectangle', rect);

                        return {
                            ...rec,
                            width: x - rec.x,
                            height: y - rec.y
                        }


                    }
                    return rec;
                }));
                break;

            case ACTIONS.CIRCLE:
                setCircles((circles) => circles.map((cir) => {

                    if (cir.id === currentShapeId.current) {

                        const circle: CircleType = { ...cir, radius: ((y - cir.y) ** 2 + (x - cir.y) ** 2) ** 0.5 };
                        socket.emit('circle', circle);

                        return {
                            ...cir,
                            radius: ((y - cir.y) ** 2 + (x - cir.y) ** 2) ** 0.5
                        }
                    }
                    return cir;
                }))
                break;

            case ACTIONS.ARROW:
                setArrows((arrows: ArrowType[]) => arrows.map((arrow: ArrowType) => {

                    if (arrow.id === currentShapeId.current) {

                        const arrowshape: ArrowType = { ...arrow, points: [arrow.points[0], arrow.points[1], x, y], fillcolor: fillcolor };
                        socket.emit('arrow', arrowshape);

                        return {
                            ...arrow,
                            points: [arrow.points[0], arrow.points[1], x, y],
                            fillcolor: fillcolor
                        }
                    }
                    return arrow;

                }));
                break;
            case ACTIONS.SCRIBBLE:
                setScribble((scribbles: ScribbleType[]) => scribbles.map((scribble) => {

                    if (scribble.id === currentShapeId.current) {

                        const scribbleshape: ArrowType = { ...scribble, points: [...scribble.points, x, y] };
                        socket.emit('scribble', scribbleshape);


                        return {
                            ...scribble,
                            points: [...scribble.points, x, y]
                        }
                    }
                    return scribble;
                }));
                break;






        }







    }


    const onpointerup = () => {
        isPainting.current = false;
    }



    const controlProps = {
        handleExport,
        action,
        setAction,
        fillcolor,
        setFillColor,
        handleFileChange,
    }

    const pointerEventHandler = {
        onpointerdown,
        onpointermove,
        onpointerup
    }

    const shapeControls = {
        arrows,
        setArrows,
        rectangles,
        setRectangles,
        scribbles,
        setScribble,
        circles,
        setCircles
    }


    






    return {
        stageRef,
        stagePos,
        setStagePos,
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
        shapeControls,
        pointerEventHandler,
        controlProps,
    }

}



export const useZoomInOut = () => {

    const [zoom, setZoom] = useState(1);
    const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 1));
    const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.01));

    return {
        zoom,
        handleZoomIn,
        handleZoomOut,
    }
}