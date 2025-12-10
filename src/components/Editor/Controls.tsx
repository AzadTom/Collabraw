import { ImageDown, Image, MousePointer2, Square, Circle, Pencil, MoveRight } from 'lucide-react';
import React, { useState } from "react";
import { ACTIONS } from "../../utils/constant";
import { cn } from '@/lib/utils';
import ColorPicker from 'react-pick-color';


interface Props {
  isDark:boolean,
  handleExport: () => void,
  action: string,
  setAction: (action: string) => void,
  fillcolor: string,
  setFillColor: (fillcolor: string) => void,
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Controls: React.FC<Props> = ({isDark, handleExport, action, setAction, fillcolor, setFillColor, handleFileChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <div className="parent-container">
      <ul className="controls-container bg-[var(--background)] p-2 rounded-xl shadow-md items-center">
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
        <li className="relative">
          <div
            className={cn(
              "w-8 h-8 rounded-md border shadow-sm cursor-pointer flex items-center justify-center transition-all",
              "hover:scale-110 hover:shadow-md"
            )}
            style={{ backgroundColor: fillcolor }}
            onClick={() => setShowPicker(!showPicker)}
          />
          {showPicker && (
            <div className="absolute top-10 left-0 z-50  p-3 rounded-xl shadow-lg flex flex-col gap-2">
              <ColorPicker  color={fillcolor} onChange={color =>setFillColor(color.hex)}/>
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



export const ZoomInOut = ({ handleZoomIn, handleZoomOut, zoom }: { handleZoomOut: () => void, handleZoomIn: () => void, zoom: number }) => {

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[var(--background)] shadow-md rounded-full px-4 py-2 text-sm" >
      <button
        onClick={handleZoomOut}
        className="px-2 py-1 rounded bg-[var(--background)]"
      >
        -
      </button>
      <span className="w-16 text-center">{Math.round(zoom * 100)}%</span>
      <button
        onClick={handleZoomIn}
        className="px-2 py-1 rounded bg-[var(--background)]"
      >
        +
      </button>
    </div>
  )

}