import { Layer, LayerType } from '@/types/canvas';
import { colorToString } from '@/utils/elementFactory';
import { useCallback, useLayoutEffect } from 'react';

const useLayerRenderer = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  layers: Map<string, Layer>,
  layerIds: string[],
  dimensions: { width: number; height: number },
  selectedLayerId: string | null
) => {
  const drawLayers = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    layerIds.forEach((id) => {
      const layer = layers.get(id);
      if (!layer) return;

      ctx.fillStyle = colorToString(layer.color);
      ctx.strokeStyle =
        id === selectedLayerId ? '#3399FF' : colorToString(layer.color);
      ctx.lineWidth = id === selectedLayerId ? 3 : 1;

      if (layer.type === LayerType.Rectangle) {
        const x = Math.min(layer.x, layer.x + layer.width);
        const y = Math.min(layer.y, layer.y + layer.height);
        const w = Math.abs(layer.width);
        const h = Math.abs(layer.height);
        ctx.strokeRect(x, y, w, h);
      } else if (layer.type === LayerType.Circle) {
        const centerX = layer.x + layer.width / 2;
        const centerY = layer.y + layer.height / 2;
        const radiusX = Math.abs(layer.width / 2);
        const radiusY = Math.abs(layer.height / 2);

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (layer.type === LayerType.Line) {
        ctx.beginPath();
        ctx.moveTo(layer.x1, layer.y1);
        ctx.lineTo(layer.x2, layer.y2);
        ctx.stroke();
      } else if (layer.type === LayerType.Arrow) {
        ctx.beginPath();
        ctx.moveTo(layer.x1, layer.y1);
        ctx.lineTo(layer.x2, layer.y2);
        ctx.stroke();

        const angle = Math.atan2(layer.y2 - layer.y1, layer.x2 - layer.x1);
        const arrowLength = 15;
        const arrowAngle = Math.PI / 6;

        ctx.beginPath();
        ctx.moveTo(layer.x2, layer.y2);
        ctx.lineTo(
          layer.x2 - arrowLength * Math.cos(angle - arrowAngle),
          layer.y2 - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(layer.x2, layer.y2);
        ctx.lineTo(
          layer.x2 - arrowLength * Math.cos(angle + arrowAngle),
          layer.y2 - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();
      } else if (layer.type === LayerType.Pencil) {
        if (layer.points.length < 2) return;

        ctx.lineWidth = id === selectedLayerId ? 3 : 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(layer.points[0].x, layer.points[0].y);

        for (let i = 1; i < layer.points.length; i++) {
          ctx.lineTo(layer.points[i].x, layer.points[i].y);
        }

        ctx.stroke();
      } else if (layer.type === LayerType.Text) {
        ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
        ctx.fillStyle = id === selectedLayerId ? '#3399FF' : colorToString(layer.color);
        ctx.textBaseline = 'top';
        ctx.fillText(layer.content, layer.x, layer.y);

        if (id === selectedLayerId) {
          const metrics = ctx.measureText(layer.content);
          const textWidth = metrics.width;
          const textHeight = layer.fontSize;
          ctx.strokeStyle = '#3399FF';
          ctx.lineWidth = 2;
          ctx.strokeRect(layer.x - 2, layer.y - 2, textWidth + 4, textHeight + 4);
        }
      }
    });
  }, [layers, layerIds, dimensions, selectedLayerId, canvasRef]);

  useLayoutEffect(() => {
    drawLayers();
  }, [drawLayers]);

  return drawLayers;
};

export default useLayerRenderer;
