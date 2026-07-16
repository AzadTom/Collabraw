import { useCallback, useState } from "react";
import { CanvasText, RectangleType, CircleType, ArrowType, ScribbleType, ImageType } from "@/types/PainTypes";

export interface CanvasState {
  rectangles: RectangleType[];
  circles: CircleType[];
  arrows: ArrowType[];
  scribbles: ScribbleType[];
  images: ImageType[];
  textList: CanvasText[];
}

export function useHistory(initialState: CanvasState, maxHistoryLen: number = 100) {
  const [history, setHistory] = useState<CanvasState[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const commit = useCallback((newState: CanvasState) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newState);
      if (newHistory.length > maxHistoryLen) {
        newHistory.shift();
      }
      return newHistory;
    });
    setCurrentIndex((prev) => Math.min(prev + 1, maxHistoryLen));
  }, [currentIndex, maxHistoryLen]);

  const undo = useCallback((applyRestore: (state: CanvasState) => void) => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      applyRestore(history[newIndex]);
    }
  }, [currentIndex, history]);

  const redo = useCallback((applyRestore: (state: CanvasState) => void) => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      applyRestore(history[newIndex]);
    }
  }, [currentIndex, history]);

  return {
    commit,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: Math.max(0, currentIndex) < history.length - 1,
  };
}
