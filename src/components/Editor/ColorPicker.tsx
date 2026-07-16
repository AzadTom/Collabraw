
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/ui/kibo-ui/color-picker";
import { ColorLike } from "color";

const ColorPickerWrapper = ({ color, onChange }: { color: string, onChange: (value: string) => void }) => {

  return (
    <div className="p-2 rounded-2xl">
      <ColorPicker color={color} onChange={(e: ColorLike) => onChange(e.toString())} className="max-w-sm rounded-md border bg-background p-4 shadow-sm" >
        <ColorPickerSelection />
        <div className="flex items-center gap-4">
          <ColorPickerEyeDropper />
          <div className="grid w-full gap-1">
            <ColorPickerHue />
            <ColorPickerAlpha />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerOutput />
          <ColorPickerFormat />
        </div>
      </ColorPicker>
    </div>
  )
}

export default ColorPickerWrapper;
