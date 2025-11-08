export interface Shape {
  id: string;
  type: 'rectangle' | 'circle' | 'line' | 'arrow' | 'text' | 'pencil';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  content?: string;
  pageId: string;
  points?: Point[];
}

export type Point = {
  x: number;
  y: number;
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: string;
}

export interface ShapesResponse {
  shapes: Shape[];
  count: number;
}
