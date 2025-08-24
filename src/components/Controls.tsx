import { ImageDown, Image, MousePointer2, Square, Circle, Pencil, MoveRight } from 'lucide-react';
import React, { useState } from "react";
import { ACTIONS } from "../utils/constant";
import { cn } from '@/lib/utils';
import { HexColorPicker } from "react-colorful";

interface Props {
  handleExport: () => void,
  action: string,
  setAction: (action: string) => void,
  fillcolor: string,
  setFillColor: (fillcolor: string) => void,
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Controls: React.FC<Props> = ({ handleExport, action, setAction, fillcolor, setFillColor, handleFileChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  // Preset colors (can expand like Canva/Figma)
  const presetColors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF"];

  return (
    <div className="parent-container">
      <ul className="controls-container bg-[var(--background)] flex gap-2 p-2 rounded-xl shadow-md items-center">
        <li className={action == ACTIONS.SELECT ? "active p-2" : ""} onClick={() => setAction(ACTIONS.SELECT)}>
          <MousePointer2 />
        </li>
        <li className={action == ACTIONS.RECTANGLE ? "active p-2" : ""} onClick={() => setAction(ACTIONS.RECTANGLE)}>
          <Square />
        </li>
        <li className={action == ACTIONS.CIRCLE ? "active p-2" : ""} onClick={() => setAction(ACTIONS.CIRCLE)}>
          <Circle />
        </li>
        <li className={action == ACTIONS.SCRIBBLE ? "active p-2" : ""} onClick={() => setAction(ACTIONS.SCRIBBLE)}>
          <Pencil />
        </li>
        <li className={action == ACTIONS.ARROW ? "active p-2" : ""} onClick={() => setAction(ACTIONS.ARROW)}>
          <MoveRight />
        </li>

        {/* Modern Color Picker */}
        <li className="relative">
          {/* Swatch button */}
          <div
            className={cn(
              "w-8 h-8 rounded-md border shadow-sm cursor-pointer flex items-center justify-center transition-all",
              "hover:scale-110 hover:shadow-md"
            )}
            style={{ backgroundColor: fillcolor }}
            onClick={() => setShowPicker(!showPicker)}
          />

          {/* Dropdown Picker */}
          {showPicker && (
            <div className="absolute top-10 left-0 z-50 bg-white p-3 rounded-xl shadow-lg flex flex-col gap-2">
              <HexColorPicker color={fillcolor} onChange={setFillColor} />

              {/* Preset Colors */}
              <div className="flex gap-2 flex-wrap mt-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFillColor(color)}
                    className="w-6 h-6 rounded-full border shadow-sm cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </li>

        <li>
          <label htmlFor="image" className="cursor-pointer">
            <Image />
          </label>
          <input id='image' type="file" style={{ display: "none" }} onChange={handleFileChange} accept='image/*' />
        </li>

        <li onClick={handleExport} className="cursor-pointer">
          <ImageDown />
        </li>
      </ul>
    </div>
  )
}

export default Controls;
