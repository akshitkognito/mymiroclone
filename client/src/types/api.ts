export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: string;
}

export interface BackendShape {
  id: string;
  type: 'rectangle' | 'square' | 'line' | 'arrow' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  content?: string;
  pageId: string;
}

export interface ShapesResponse {
  shapes: BackendShape[];
  count: number;
}
