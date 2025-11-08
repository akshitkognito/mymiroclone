import { shapeService } from '@/services/shape.services';
import { Color, Layer, LayerType, Point } from '@/types/canvas';
import { generateId, MAX_LAYERS } from '@/utils/elementFactory';
import { useCallback, useEffect, useRef, useState } from 'react';

const useLayerManagement = (
  lastUsedColor: Color,
  pageId: string = 'default'
) => {
  const [layers, setLayers] = useState<Map<string, Layer>>(new Map());
  const [layerIds, setLayerIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const pendingOperations = useRef<
    Map<
      string,
      {
        type: 'create' | 'update' | 'delete';
        layer?: Layer;
        timeout?: NodeJS.Timeout;
      }
    >
  >(new Map());

  const syncedLayers = useRef<Set<string>>(new Set());

  useEffect(() => {
    const loadShapes = async () => {
      setIsLoading(true);
      try {
        const shapes = await shapeService.getAllShapes(pageId);
        const newLayers = new Map<string, Layer>();
        const newLayerIds: string[] = [];

        shapes.forEach((shape) => {
          newLayers.set(shape.id, shape);
          newLayerIds.push(shape.id);
          syncedLayers.current.add(shape.id);
        });

        setLayers(newLayers);
        setLayerIds(newLayerIds);
      } catch (error) {
        console.error('Failed to load shapes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShapes();
  }, [pageId]);

  useEffect(() => {
    return () => {
      pendingOperations.current.forEach((op) => {
        if (op.timeout) clearTimeout(op.timeout);
      });
    };
  }, []);

  const scheduleSync = useCallback(
    (
      layerId: string,
      layer: Layer,
      operationType: 'create' | 'update',
      delay: number = 500
    ) => {
      const existing = pendingOperations.current.get(layerId);
      if (existing?.timeout) {
        clearTimeout(existing.timeout);
      }

      const isSynced = syncedLayers.current.has(layerId);
      const finalOperationType = isSynced ? 'update' : 'create';

      const timeout = setTimeout(async () => {
        try {
          if (finalOperationType === 'create') {
            await shapeService.createShape(layer, pageId);
            syncedLayers.current.add(layerId);
          } else {
            await shapeService.updateShape(layerId, layer, pageId);
          }
          pendingOperations.current.delete(layerId);
        } catch (error) {
          console.error(
            `Failed to ${finalOperationType} shape on backend:`,
            error
          );
          if (finalOperationType === 'create') {
            syncedLayers.current.delete(layerId);
          }
        }
      }, delay);

      pendingOperations.current.set(layerId, {
        type: finalOperationType,
        layer,
        timeout,
      });
    },
    [pageId]
  );

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
      } else if (layerType === LayerType.Text) {
        newLayer = {
          type: LayerType.Text,
          id: newLayerId,
          x: position.x,
          y: position.y,
          content: 'Text',
          color: lastUsedColor,
          fontFamily: 'Arial',
          fontSize: 16,
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
    (layerId: string, updates: Partial<Layer>, immediate: boolean = false) => {
      setLayers((prev) => {
        const layer = prev.get(layerId);

        if (!layer) return prev;

        const updatedLayer = { ...layer, ...updates } as Layer;
        const updated = new Map(prev);
        updated.set(layerId, updatedLayer);

        const delay = immediate ? 0 : 100;
        scheduleSync(layerId, updatedLayer, 'update', delay);

        return updated;
      });
    },
    [scheduleSync]
  );

  const deleteLayer = useCallback((layerId: string) => {
    const pending = pendingOperations.current.get(layerId);
    if (pending?.timeout) {
      clearTimeout(pending.timeout);
    }
    pendingOperations.current.delete(layerId);

    setLayers((prev) => {
      const updated = new Map(prev);
      updated.delete(layerId);
      return updated;
    });
    setLayerIds((prev) => prev.filter((id) => id !== layerId));

    if (syncedLayers.current.has(layerId)) {
      shapeService.deleteShape(layerId).catch((error) => {
        console.error('Failed to delete shape on backend:', error);
      });
      syncedLayers.current.delete(layerId);
    }
  }, []);

  const finishDrawing = useCallback(
    (layerId: string) => {
      const layer = layers.get(layerId);
      if (!layer) return;

      const pending = pendingOperations.current.get(layerId);
      if (pending?.timeout) {
        clearTimeout(pending.timeout);
      }

      const isSynced = syncedLayers.current.has(layerId);

      if (isSynced) {
        shapeService.updateShape(layerId, layer, pageId).catch((error) => {
          console.error('Failed to update shape on backend:', error);
        });
      } else {
        shapeService
          .createShape(layer, pageId)
          .then(() => {
            syncedLayers.current.add(layerId);
          })
          .catch((error) => {
            console.error('Failed to create shape on backend:', error);
          });
      }

      pendingOperations.current.delete(layerId);
    },
    [layers, pageId]
  );

  return {
    layers,
    layerIds,
    insertLayer,
    updateLayer,
    deleteLayer,
    isLoading,
    finishDrawing,
  };
};

export default useLayerManagement;
