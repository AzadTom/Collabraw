import { CanvasText } from "@/types/PainTypes";
import { useState } from "react"
import { v4 as uuid } from "uuid";


export const useText = () => {
    const [textList, setTextList] = useState<CanvasText[]>([]);
    const [editingTextId, setEditingTextId] = useState<string | null>(null);


    const addText = (text: string, x: number, y: number) => {
        const id = uuid();
        setTextList(prev => [
            ...prev,
            {
                id,
                text,
                x,
                y,
                fontSize: 20,
                fill: "white",
                draggable: true,
                width: 200,
            },
        ]);
        return id;
    };


    const updateText = (id: string, updates: Partial<CanvasText>) => {
        setTextList(prev =>
            prev.map(item => (item.id === id ? { ...item, ...updates } : item))
        );
    };

    const removeText = (id: string) => {
        setTextList(prev => prev.filter(item => item.id !== id));
    };

    return {
        textList,
        addText,
        updateText,
        removeText,
        editingTextId,
        setEditingTextId,
        setTextList
    };
};
