import React, { useRef, useState, useMemo } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";
import Konva from "konva";
import { useWindowSize } from "@/hooks/utility/utility";

// 🔹 Hook for grid pattern
const useGridPattern = (gridSize: number, stroke = "#333") => {
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

// 🔹 Hook for stage state (zoom & pan)
const useStageControls = (viewportWidth: number, viewportHeight: number) => {
    const stageRef = useRef<Konva.Stage>(null);
    const [stageScale, setStageScale] = useState<number>(1);
    const [stagePos, setStagePos] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;

        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        if (e.evt.ctrlKey || e.evt.metaKey) {
            const scaleBy = 1.05;
            const oldScale = stage.scaleX();

            const mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };

            const direction = e.evt.deltaY > 0 ? -1 : 1;
            const newScale =
                direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

            setStageScale(newScale);
            setStagePos({
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            });
        } else {
            setStagePos((prev) => ({
                x: prev.x - e.evt.deltaX,
                y: prev.y - e.evt.deltaY,
            }));
        }
    };

    const zoom = (factor: number) => {
        const stage = stageRef.current;
        if (!stage) return;

        const oldScale = stage.scaleX();
        const newScale = oldScale * factor;
        setStageScale(newScale);

        const center = { x: viewportWidth / 2, y: viewportHeight / 2 };
        const mousePointTo = {
            x: (center.x - stage.x()) / oldScale,
            y: (center.y - stage.y()) / oldScale,
        };

        setStagePos({
            x: center.x - mousePointTo.x * newScale,
            y: center.y - mousePointTo.y * newScale,
        });
    };

    return { stageRef, stageScale, stagePos, handleWheel, zoom };
};

// 🔹 Main Component
interface InfiniteCanvasProps {
    gridSize?: number;
    gridColor?: string;
}


const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({
    gridSize = 50,
    gridColor = "#333",
}) => {
    const [viewportWidth, viewportHeight] = useWindowSize();
    const gridPattern = useGridPattern(gridSize, gridColor);
    const { stageRef, stageScale, stagePos, handleWheel, zoom } =
        useStageControls(viewportWidth, viewportHeight);

    return (
        <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
            <Stage
                ref={stageRef}
                width={viewportWidth}
                height={viewportHeight}
                scaleX={stageScale}
                scaleY={stageScale}
                x={stagePos.x}
                y={stagePos.y}
                onWheel={handleWheel}
                style={{ background: "#1e1e1e" }}
            >
                {/* Infinite Grid Background */}
                <Layer>
                    <Rect
                        x={-100000}
                        y={-100000}
                        width={200000}
                        height={200000}
                        fillPatternImage={gridPattern}
                        fillPatternRepeat="repeat"
                    />
                </Layer>

                {/* Content */}
                <Layer>
                    <Rect
                        x={-150}
                        y={-100}
                        width={300}
                        height={200}
                        fill="lightblue"
                        draggable
                    />
                    <Text
                        x={200}
                        y={0}
                        text="Infinite Canvas 🚀"
                        fontSize={32}
                        fill="white"
                        draggable
                    />
                    <Rect x={500} y={300} width={300} height={150} fill="pink" draggable />
                    <Rect
                        x={50000}
                        y={300}
                        width={300}
                        height={150}
                        fill="pink"
                        draggable
                    />
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
                    onClick={() => zoom(1.1)}
                    style={{ padding: "4px 8px", borderRadius: "4px" }}
                >
                    ➕
                </button>
                <span>{Math.round(stageScale * 100)}%</span>
                <button
                    onClick={() => zoom(0.9)}
                    style={{ padding: "4px 8px", borderRadius: "4px" }}
                >
                    ➖
                </button>
            </div>
        </div>
    );
};

export default InfiniteCanvas;
