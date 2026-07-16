import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Text, Group, Rect } from "react-konva";
import { Html } from "react-konva-utils";
import { CanvasText } from "@/types/PainTypes";
import Konva from "konva";

interface TextNodeProps {
  shape: CanvasText;
  isEditing: boolean;
  onEditStart: () => void;
  onChange: (newText: string) => void;
  onPositionChange: (x: number, y: number) => void;
  onBlur: () => void;
  onSelect?: (e: any) => void;
  onTransformEnd?: (newProps: { x: number; y: number; width: number; fontSize: number }) => void;
}

const TextNode = ({
  shape,
  isEditing,
  onEditStart,
  onChange,
  onPositionChange,
  onBlur,
  onSelect,
  onTransformEnd,
}: TextNodeProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const textValue = shape.text || "";
  const textWidth = shape.width || 200;

  const [textareaDims, setTextareaDims] = useState({
    width: textWidth,
    height: shape.fontSize * 1.5,
  });

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);


  useLayoutEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";

      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";

      setTextareaDims({
        width: textWidth,
        height: scrollHeight,
      });
    }
  }, [shape.text, isEditing, textWidth, shape.fontSize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      onBlur();
    }
  };



  return (
    <Group
      x={shape.x}
      y={shape.y}
      draggable={shape.draggable}
      onDragEnd={(e) => {
        onPositionChange(e.target.x(), e.target.y());
      }}
      onClick={(e) => {
        if (!isEditing) onSelect?.(e);
      }}
      onTap={(e) => {
        if (!isEditing) onSelect?.(e);
      }}
      onDblClick={!isEditing ? onEditStart : undefined}
      onDblTap={!isEditing ? onEditStart : undefined}
      onTransform={(e) => {
        const node = e.target as Konva.Group;
        const textNode = node.findOne('.textTarget') as Konva.Text;
        if (textNode) {
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          textNode.width(Math.max(5, textNode.width() * scaleX));
          textNode.fontSize(Math.max(5, textNode.fontSize() * scaleY));
        }
      }}
      onTransformEnd={(e) => {
        const node = e.target as Konva.Group;
        const textNode = node.findOne('.textTarget') as Konva.Text;
        if (textNode && onTransformEnd) {
          onTransformEnd({
            x: node.x(),
            y: node.y(),
            width: textNode.width(),
            fontSize: textNode.fontSize(),
          });
        }
      }}
    >
      {isEditing && (
        <Rect
          x={-10}
          y={-10}
          width={textareaDims.width + 20}
          height={textareaDims.height + 20}
          fill="transparent"
          stroke="#0096ff"
          strokeWidth={1}
          dash={[5, 5]}
        />
      )}

      {isEditing ? (
        <Html transform={true}>
          <textarea
            ref={textareaRef}
            value={textValue}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            placeholder="Type something..."
            style={{
              width: `${textareaDims.width}px`,
              minHeight: `${shape.fontSize * 1.5}px`,
              height: `${textareaDims.height}px`,
              fontSize: `${shape.fontSize}px`,
              fontFamily: shape.fontFamily || "sans-serif",
              color: shape.fill || "black",
              background: "transparent",
              outline: "none",
              border: "none",
              padding: "0px",
              margin: "0px",
              resize: "none",
              overflow: "hidden",
              lineHeight: "1.2",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          />
        </Html>
      ) : (
        <Text
          name="textTarget"
          text={textValue}
          fontSize={shape.fontSize}
          fontFamily={shape.fontFamily}
          fill={shape.fill || "black"}
          width={textWidth}
        />
      )}
    </Group>
  );
};

export default TextNode;
