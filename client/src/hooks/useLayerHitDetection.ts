import { Layer, LayerType, Point } from '@/types/canvas';
import { useCallback } from 'react';

const useLayerHitDetection = (
  layers: Map<string, Layer>,
  layerIds: string[]
) => {
  return useCallback(
    (point: Point): string | null => {
      for (let i = layerIds.length - 1; i >= 0; i--) {
        const id = layerIds[i];

        const layer = layers.get(id);
        if (!layer) continue;

        if (layer.type === LayerType.Rectangle) {
          const minX = Math.min(layer.x, layer.x + layer.width);
          const maxX = Math.max(layer.x, layer.x + layer.width);
          const minY = Math.min(layer.y, layer.y + layer.height);
          const maxY = Math.max(layer.y, layer.y + layer.height);

          if (
            point.x >= minX &&
            point.x <= maxX &&
            point.y >= minY &&
            point.y <= maxY
          ) {
            return id;
          }
        } else if (layer.type === LayerType.Circle) {
          const centerX = layer.x + layer.width / 2;
          const centerY = layer.y + layer.height / 2;
          const radiusX = Math.abs(layer.width / 2);
          const radiusY = Math.abs(layer.height / 2);

          const normalizedX = (point.x - centerX) / radiusX;
          const normalizedY = (point.y - centerY) / radiusY;

          if (normalizedX * normalizedX + normalizedY * normalizedY <= 1) {
            return id;
          }
        } else if (
          layer.type === LayerType.Line ||
          layer.type === LayerType.Arrow
        ) {
          const tolerance = 5;
          const dx = layer.x2 - layer.x1;
          const dy = layer.y2 - layer.y1;
          const lengthSquared = dx * dx + dy * dy;

          if (lengthSquared === 0) {
            const dist = Math.sqrt(
              (point.x - layer.x1) ** 2 + (point.y - layer.y1) ** 2
            );
            if (dist <= tolerance) return id;
          } else {
            const t = Math.max(
              0,
              Math.min(
                1,
                ((point.x - layer.x1) * dx + (point.y - layer.y1) * dy) /
                  lengthSquared
              )
            );
            const closestX = layer.x1 + t * dx;
            const closestY = layer.y1 + t * dy;
            const dist = Math.sqrt(
              (point.x - closestX) ** 2 + (point.y - closestY) ** 2
            );

            if (dist <= tolerance) return id;
          }
        } else if (layer.type === LayerType.Pencil) {
          const tolerance = 5;

          for (let i = 0; i < layer.points.length - 1; i++) {
            const p1 = layer.points[i];
            const p2 = layer.points[i + 1];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const lengthSquared = dx * dx + dy * dy;

            if (lengthSquared === 0) {
              const dist = Math.sqrt(
                (point.x - p1.x) ** 2 + (point.y - p1.y) ** 2
              );
              if (dist <= tolerance) return id;
            } else {
              const t = Math.max(
                0,
                Math.min(
                  1,
                  ((point.x - p1.x) * dx + (point.y - p1.y) * dy) /
                    lengthSquared
                )
              );
              const closestX = p1.x + t * dx;
              const closestY = p1.y + t * dy;
              const dist = Math.sqrt(
                (point.x - closestX) ** 2 + (point.y - closestY) ** 2
              );

              if (dist <= tolerance) return id;
            }
          }
        } else if (layer.type === LayerType.Text) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
            const metrics = ctx.measureText(layer.content);
            const textWidth = metrics.width;
            const textHeight = layer.fontSize;

            if (
              point.x >= layer.x &&
              point.x <= layer.x + textWidth &&
              point.y >= layer.y &&
              point.y <= layer.y + textHeight
            ) {
              return id;
            }
          }
        }
      }
      return null;
    },
    [layers, layerIds]
  );
};

export default useLayerHitDetection;
