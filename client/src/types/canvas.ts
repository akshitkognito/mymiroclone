export type ToolType = 'line' | 'rectangle';

export interface CreateElementType {
  id: number;
  type: ToolType;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export type Color = {
  r: number;
  g: number;
  b: number;
};

export enum LayerType {
  Rectangle,
  Circle,
  Arrow,
  Line,
  Pencil,
  Text,
}

export type RectangleLayer = {
  id: string;
  type: LayerType.Rectangle;
  x: number;
  y: number;
  height: number;
  width: number;
  color: Color;
  value?: string;
};

export type CircleLayer = {
  id: string;
  type: LayerType.Circle;
  x: number;
  y: number;
  height: number;
  width: number;
  color: Color;
  value?: string;
};

export type LineLayer = {
  id: string;
  type: LayerType.Line;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: Color;
};

export type ArrowLayer = {
  type: LayerType.Arrow;
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: Color;
};

export type PencilLayer = {
  type: LayerType.Pencil;
  id: string;
  points: Point[];
  color: Color;
};

export type TextLayer = {
  type: LayerType.Text;
  id: string;
  x: number;
  y: number;
  content: string;
  color: Color;
  fontFamily: string;
  fontSize: number;
};

export type Point = {
  x: number;
  y: number;
};

export type CanvasState =
  | {
      mode: CanvasMode.None;
    }
  | {
      mode: CanvasMode.Pressing;
      origin: Point;
    }
  | {
      mode: CanvasMode.Translating;
      current: Point;
    }
  | {
      mode: CanvasMode.Inserting;
      layerType: LayerType;
    }
  | {
      mode: CanvasMode.Inserting;
      layerType: LayerType.Circle;
    }
  | {
      mode: CanvasMode.Inserting;
      layerType: LayerType.Line;
    }
  | {
      mode: CanvasMode.Inserting;
      layerType: LayerType.Arrow;
    }
  | {
      mode: CanvasMode.Inserting;
      layerType: LayerType.Pencil;
    }
  | {
      mode: CanvasMode.Resizing;
      handle: ResizeHandle;
      origin: Point;
    };

export enum ResizeHandle {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
  Top,
  Bottom,
  Left,
  Right,
  Start, // For lines/arrows
  End, // For lines/arrows
}

export enum CanvasMode {
  None,
  Pressing,
  Translating,
  Inserting,
  Resizing,
}

export type Layer =
  | RectangleLayer
  | CircleLayer
  | LineLayer
  | ArrowLayer
  | PencilLayer
  | TextLayer;
