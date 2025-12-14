import { Text } from "react-konva";
import { Html } from "react-konva-utils";
import { memo, useEffect, useRef } from "react";

/* =========================
   TYPES
========================= */

export interface TextType {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fillcolor: string;
  text?: string;
  fontSize?: number;
}

interface EditableTextProps {
  shape: TextType;
  isEditing: boolean;
  isSelected: boolean;
  transformerRef: React.RefObject<any>;
  onSelect: (id: string) => void;
  onStartEdit: (id: string) => void;
  onCommit: (id: string, value: string, width: number) => void;
}

/* =========================
   TEXT WIDTH MEASURER
========================= */

const measureTextWidth = (text: string, fontSize: number) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = `${fontSize}px Arial`;
  return ctx.measureText(text).width;
};

/* =========================
   EDITABLE TEXT (MEMOIZED)
========================= */

const EditableText = memo(
  ({
    shape,
    isEditing,
    isSelected,
    transformerRef,
    onSelect,
    onStartEdit,
    onCommit,
  }: EditableTextProps) => {
    const textRef = useRef<any>(null);

    useEffect(() => {
      if (
        isSelected &&
        !isEditing &&
        transformerRef.current &&
        textRef.current
      ) {
        transformerRef.current.nodes([textRef.current]);
      }
    }, [isSelected, isEditing, transformerRef]);

    return (
      <>
        {/* ===== KONVA TEXT ===== */}
        <Text
          ref={textRef}
          x={shape.x}
          y={shape.y}
          text={shape.text || ""}
          width={shape.width}
          wrap="none"
          ellipsis={false}
          fontSize={shape.fontSize || 20}
          fill={shape.fillcolor}
          draggable={isSelected && !isEditing}
          visible={!isEditing}
          listening={!isEditing}
          perfectDrawEnabled={false}
          hitStrokeWidth={0}
          onPointerDown={(e) => {
            e.cancelBubble = true;
            onSelect(shape.id);
          }}
          onDblClick={() => {
            onSelect(shape.id);
            onStartEdit(shape.id);
          }}
          onDblTap={() => {
            onSelect(shape.id);
            onStartEdit(shape.id);
          }}
        />

        {/* ===== HTML INPUT ===== */}
        {isEditing && (
          <Html>
            <TextInput
              textNode={textRef.current}
              value={shape.text || ""}
              fontSize={shape.fontSize || 20}
              onCommit={(value, width) =>
                onCommit(shape.id, value, width)
              }
            />
          </Html>
        )}
      </>
    );
  }
);

export default EditableText;

/* =========================
   HTML TEXT INPUT
========================= */

const TextInput = ({
  textNode,
  value,
  fontSize,
  onCommit,
}: {
  textNode: any;
  value: string;
  fontSize: number;
  onCommit: (value: string, width: number) => void;
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textNode || !ref.current) return;

    const textarea = ref.current;
    const stage = textNode.getStage();
    const abs = textNode.absolutePosition();
    const box = stage.container().getBoundingClientRect();
    const scale = textNode.getAbsoluteScale().x;

    textarea.value = value;

    /* ===== STYLE ===== */
    textarea.style.position = "absolute";
    textarea.style.left = box.left + abs.x * scale + "px";
    textarea.style.top = box.top + abs.y * scale + "px";
    textarea.style.width = textNode.width() * scale + "px";
    textarea.style.fontSize = fontSize * scale + "px";
    textarea.style.fontFamily = "Arial";
    textarea.style.lineHeight = "1.4";
    textarea.style.color = textNode.fill();
    textarea.style.background = "transparent";
    textarea.style.border = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.overflow = "hidden";
    textarea.style.whiteSpace = "pre";
    textarea.style.wordBreak = "keep-all";

    textarea.focus();

    const updateWidth = () => {
      const val = textarea.value;
      const lines = val.split("\n");

      // Auto-grow only for single line
      if (lines.length === 1) {
        const w =
          measureTextWidth(val || " ", fontSize) + 10;
        textarea.style.width = w * scale + "px";
        textNode.width(w);
      }
    };

    updateWidth();

    const commit = () => {
      const finalWidth = textNode.width();
      onCommit(textarea.value, finalWidth);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        commit();
      }
    };

    const handleOutside = (e: PointerEvent) => {
      if (e.target !== textarea) commit();
    };

    textarea.addEventListener("input", updateWidth);
    textarea.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handleOutside, true);

    return () => {
      textarea.removeEventListener("input", updateWidth);
      textarea.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handleOutside, true);
    };
  }, [textNode, value, fontSize, onCommit]);

  return <textarea ref={ref} />;
};
