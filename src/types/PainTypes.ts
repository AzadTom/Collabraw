export interface ArrowType {
    id: string;
    points: number[];
    fillcolor: string;
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
}



  export interface CanvasText {
    id: string;
    text: string;        
    x: number;           
    y: number;
    fontSize: number;    
    fontFamily?: string; 
    fill?: string;
    draggable?: boolean;
    width?: number;
  }

  export interface ScribbleType {
    id: string;
    points: number[];
    fillcolor: string;
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
  }


  export interface RectangleType {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fillcolor: string;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
  }

  export interface ImageType {
    id: string;
    x: number;
    y: number;
    src: string | null;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
  }


  export interface CircleType {
    id: string;
    x: number;
    y: number;
    radius: number;
    fillcolor: string;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
  }