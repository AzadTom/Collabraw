import { Image, MousePointer2, Square, Circle, Pencil, MoveRight, Download, Text, Undo2, Redo2 } from 'lucide-react';
import React from "react";
import { ACTIONS } from "../../utils/constant";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export interface Props {
  isDark: boolean,
  handleExport: () => void,
  action: string,
  setAction: (action: string) => void,
  fillcolor: string,
  setFillColor: (fillcolor: string) => void,
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleUndo: () => void,
  handleRedo: () => void,
  canUndo: boolean,
  canRedo: boolean
}

const Controls: React.FC<Props> = ({ handleExport, action, setAction, handleFileChange, handleUndo, handleRedo, canUndo, canRedo }) => {
  return (
    <SidebarMenu className="gap-2 cursor-pointer">
      <SidebarMenuItem className='pl-2'>
        <SidebarMenuButton isActive={action === ACTIONS.SELECT} onClick={() => setAction(ACTIONS.SELECT)}>
          <MousePointer2 style={{marginLeft:"8px"}} /> Select
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton isActive={action === ACTIONS.RECTANGLE} onClick={() => setAction(ACTIONS.RECTANGLE)}>
          <Square style={{marginLeft:"8px"}}   /> Rectangle
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton isActive={action === ACTIONS.CIRCLE} onClick={() => setAction(ACTIONS.CIRCLE)}>
          <Circle style={{marginLeft:"8px"}} /> Circle
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton isActive={action === ACTIONS.SCRIBBLE} onClick={() => setAction(ACTIONS.SCRIBBLE)}>
          <Pencil style={{marginLeft:"8px"}} /> Draw
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton isActive={action === ACTIONS.ARROW} onClick={() => setAction(ACTIONS.ARROW)}>
          <MoveRight style={{marginLeft:"8px"}} /> Arrow
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton isActive={action === ACTIONS.TEXT} onClick={() => setAction(ACTIONS.TEXT)}>
          <Text style={{marginLeft:"8px"}} /> Text
        </SidebarMenuButton>
      </SidebarMenuItem>

      <div className="my-4 border-t w-full opacity-50" />

      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <label htmlFor="image" className="cursor-pointer">
            <Image style={{marginLeft:"8px"}}  /> Import Image
          </label>
        </SidebarMenuButton>
        <input id="image" type="file" multiple style={{ display: "none" }} onChange={handleFileChange} accept="image/*" />
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton disabled={!canUndo} onClick={canUndo ? handleUndo : undefined}>
          <Undo2 style={{marginLeft:"8px"}} /> Undo
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton disabled={!canRedo} onClick={canRedo ? handleRedo : undefined}>
          <Redo2 style={{marginLeft:"8px"}} /> Redo
        </SidebarMenuButton>
      </SidebarMenuItem>

      <div className="my-4 border-t w-full opacity-50" />

      <SidebarMenuItem>
        <SidebarMenuButton onClick={handleExport}>
          <Download style={{marginLeft:"8px"}} /> Export Canvas
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default Controls;