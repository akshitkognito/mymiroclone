import { Color, Layer, LayerType, Point } from '@/types/canvas';
import { generateId, MAX_LAYERS } from '@/utils/elementFactory';
import { useCallback, useState } from 'react';

const useLayerManagement = (lastUsedColor: Color) => {
  const [layers, setLayers] = useState<Map<string, Layer>>(new Map());
  const [layerIds, setLayerIds] = useState<string[]>([]);

  const insertLayer = useCallback(
    (layerType: LayerType, position: Point) => {
      if (layerIds.length >= MAX_LAYERS) return null;

      const newLayerId = generateId();
      let newLayer: Layer;

      if (layerType === LayerType.Rectangle) {
        newLayer = {
          type: LayerType.Rectangle,
          id: newLayerId,
          x: position.x,
          y: position.y,
          width: 0,
          height: 0,
          color: lastUsedColor,
        };
      } else if (layerType === LayerType.Circle) {
        newLayer = {
          type: LayerType.Circle,
          id: newLayerId,
          x: position.x,
          y: position.y,
          width: 0,
          height: 0,
          color: lastUsedColor,
        };
      } else if (layerType === LayerType.Line) {
        newLayer = {
          type: LayerType.Line,
          id: newLayerId,
          x1: position.x,
          y1: position.y,
          x2: position.x,
          y2: position.y,
          color: lastUsedColor,
        };
      } else if (layerType === LayerType.Pencil) {
        newLayer = {
          type: LayerType.Pencil,
          id: newLayerId,
          points: [position],
          color: lastUsedColor,
        };
      } else {
        newLayer = {
          type: LayerType.Arrow,
          id: newLayerId,
          x1: position.x,
          y1: position.y,
          x2: position.x,
          y2: position.y,
          color: lastUsedColor,
        };
      }

      setLayers((prev) => new Map(prev).set(newLayerId, newLayer));
      setLayerIds((prev) => [...prev, newLayerId]);

      return newLayerId;
    },
    [layerIds, lastUsedColor]
  );

  const updateLayer = useCallback(
    (layerId: string, updates: Partial<Layer>) => {
      setLayers((prev) => {
        const layer = prev.get(layerId);

        if (!layer) return prev;

        const updated = new Map(prev);
        updated.set(layerId, { ...layer, ...updates } as Layer);

        return updated;
      });
    },
    []
  );

  const deleteLayer = useCallback((layerId: string) => {
    setLayers((prev) => {
      const updated = new Map(prev);
      updated.delete(layerId);

      return updated;
    });
    setLayerIds((prev) => prev.filter((id) => id !== layerId));
  }, []);

  return { layers, layerIds, insertLayer, updateLayer, deleteLayer };
};

export default useLayerManagement;
