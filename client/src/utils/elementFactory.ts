import { Color, Layer, LayerType, ShapeDto } from '@/types/canvas';

export const colorToString = (color: Color) =>
  `rgb(${color.r}, ${color.g}, ${color.b})`;

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const MAX_LAYERS = 100;

export const layerToShapeDto = (
  layer: Layer,
  pageId: string = 'default'
): ShapeDto => {
  const baseShape = {
    id: layer.id,
    pageId,
    color: `rgb(${layer.color.r}, ${layer.color.g}, ${layer.color.b})`,
  };

  switch (layer.type) {
    case LayerType.Rectangle:
      return {
        ...baseShape,
        type: 'rectangle',
        x: layer.x,
        y: layer.y,
        width: layer.width,
        height: layer.height,
      };
    case LayerType.Circle:
      return {
        ...baseShape,
        type: 'circle',
        x: layer.x,
        y: layer.y,
        width: layer.width,
        height: layer.height,
      };
    case LayerType.Line:
      return {
        ...baseShape,
        type: 'line',
        x: layer.x1,
        y: layer.y1,
        width: layer.x2 - layer.x1,
        height: layer.y2 - layer.y1,
      };
    case LayerType.Arrow:
      return {
        ...baseShape,
        type: 'arrow',
        x: layer.x1,
        y: layer.y1,
        width: layer.x2 - layer.x1,
        height: layer.y2 - layer.y1,
      };
    case LayerType.Text:
      return {
        ...baseShape,
        type: 'text',
        x: layer.x,
        y: layer.y,
        content: layer.content,
        fontSize: layer.fontSize,
        fontFamily: layer.fontFamily,
      };
    case LayerType.Pencil:
      return {
        ...baseShape,
        type: 'pencil',
        points: layer.points,
      };
    default:
      throw new Error(`Unsupported layer type`);
  }
};

export const shapeDtoToLayer = (shape: ShapeDto): Layer | null => {
  const parseColor = (colorStr: string) => {
    const match = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
      };
    }
    return { r: 0, g: 0, b: 0 };
  };

  const color = shape.color ? parseColor(shape.color) : { r: 0, g: 0, b: 0 };

  switch (shape.type) {
    case 'rectangle':
      return {
        id: shape.id,
        type: LayerType.Rectangle,
        x: shape.x!,
        y: shape.y!,
        width: shape.width || 0,
        height: shape.height || 0,
        color,
      };
    case 'circle':
      return {
        id: shape.id,
        type: LayerType.Circle,
        x: shape.x!,
        y: shape.y!,
        width: shape.width || 0,
        height: shape.height || 0,
        color,
      };
    case 'line':
      return {
        id: shape.id,
        type: LayerType.Line,
        x1: shape.x!,
        y1: shape.y!,
        x2: shape.x! + (shape.width || 0),
        y2: shape.y! + (shape.height || 0),
        color,
      };
    case 'arrow':
      return {
        id: shape.id,
        type: LayerType.Arrow,
        x1: shape.x!,
        y1: shape.y!,
        x2: shape.x! + (shape.width || 0),
        y2: shape.y! + (shape.height || 0),
        color,
      };
    case 'text':
      return {
        id: shape.id,
        type: LayerType.Text,
        x: shape.x!,
        y: shape.y!,
        content: shape.content || 'Text',
        fontSize: shape.fontSize || 16,
        fontFamily: shape.fontFamily || 'Arial',
        color,
      };
    case 'pencil':
      return {
        id: shape.id,
        type: LayerType.Pencil,
        points: shape.points || [],
        color,
      };
    default:
      return null;
  }
};
