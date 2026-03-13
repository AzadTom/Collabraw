import {Image, MousePointer2, Square, Circle, Pencil, MoveRight, Download, Text } from 'lucide-react';
import React from "react";
import { ACTIONS } from "../../utils/constant";


interface Props {
  isDark:boolean,
  handleExport: () => void,
  action: string,
  setAction: (action: string) => void,
  fillcolor: string,
  setFillColor: (fillcolor: string) => void,
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Controls: React.FC<Props> = ({handleExport, action, setAction,handleFileChange }) => {
  return (
    <div className="parent-container w-full">
      <ul className="controls-container bg-[var(--background)] p-2 sm:rounded-xl shadow-md items-center">
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
        <li className={action == ACTIONS.TEXT ? "active p-2" : ""} onClick={()=> setAction(ACTIONS.TEXT)}>
          <Text/>
        </li>
        {/* <li className="relative hidden sm:block">
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
        </li> */}
        <li>
          <label htmlFor="image" className="cursor-pointer">
            <Image />
          </label>
          <input id='image' type="file" style={{ display: "none" }} onChange={handleFileChange} accept='image/*' />
        </li>

        <li onClick={handleExport} className="cursor-pointer mx-4">
           <Download/>
        </li>
      </ul>
    </div>
  )
}

export default Controls;