import { Layer, LayerType } from '@/types/canvas';
import { BackendShape } from '@/types/api';
import { colorToString } from './elementFactory';

export const layerToBackendShape = (
  layer: Layer,
  pageId: string
): BackendShape | null => {
  switch (layer.type) {
    case LayerType.Rectangle:
      return {
        id: layer.id,
        type: 'rectangle',
        x: layer.x,
        y: layer.y,
        width: layer.width,
        height: layer.height,
        color: colorToString(layer.color),
        pageId,
      };

    case LayerType.Circle:
      return {
        id: layer.id,
        type: 'square',
        x: layer.x,
        y: layer.y,
        width: layer.width,
        height: layer.height,
        color: colorToString(layer.color),
        pageId,
      };

    case LayerType.Line:
      return {
        id: layer.id,
        type: 'line',
        x: layer.x1,
        y: layer.y1,
        width: layer.x2 - layer.x1,
        height: layer.y2 - layer.y1,
        color: colorToString(layer.color),
        pageId,
      };

    case LayerType.Arrow:
      return {
        id: layer.id,
        type: 'arrow',
        x: layer.x1,
        y: layer.y1,
        width: layer.x2 - layer.x1,
        height: layer.y2 - layer.y1,
        color: colorToString(layer.color),
        pageId,
      };

    case LayerType.Text:
      return {
        id: layer.id,
        type: 'text',
        x: layer.x,
        y: layer.y,
        content: layer.content,
        color: colorToString(layer.color),
        fontFamily: layer.fontFamily,
        fontSize: layer.fontSize,
        pageId,
      };

    default:
      return null;
  }
};

export const backendShapeToLayer = (shape: BackendShape): Layer | null => {
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
        x: shape.x,
        y: shape.y,
        width: shape.width || 0,
        height: shape.height || 0,
        color,
      };

    case 'square':
      return {
        id: shape.id,
        type: LayerType.Circle,
        x: shape.x,
        y: shape.y,
        width: shape.width || 0,
        height: shape.height || 0,
        color,
      };

    case 'line':
      return {
        id: shape.id,
        type: LayerType.Line,
        x1: shape.x,
        y1: shape.y,
        x2: shape.x + (shape.width || 0),
        y2: shape.y + (shape.height || 0),
        color,
      };

    case 'arrow':
      return {
        id: shape.id,
        type: LayerType.Arrow,
        x1: shape.x,
        y1: shape.y,
        x2: shape.x + (shape.width || 0),
        y2: shape.y + (shape.height || 0),
        color,
      };

    case 'text':
      return {
        id: shape.id,
        type: LayerType.Text,
        x: shape.x,
        y: shape.y,
        content: shape.content || '',
        color,
        fontFamily: shape.fontFamily || 'Arial',
        fontSize: shape.fontSize || 16,
      };

    default:
      return null;
  }
};
