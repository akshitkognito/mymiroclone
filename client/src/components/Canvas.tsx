import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
} from '../types/canvas';
import Toolbar from './Toolbar';
import useCanvasDimensions from '@/hooks/useCanvasDimensions';
import useLayerManagement from '@/hooks/useLayerManagement';
import useLayerHitDetection from '@/hooks/useLayerHitDetection';
import useLayerRenderer from '@/hooks/useLayerRenderer';

const Canvas = () => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef<{ startPoint: Point; layerId: string } | null>(
    null
  );
  const draggingRef = useRef<{ layerId: string; offset: Point } | null>(null);

  const dimensions = useCanvasDimensions();

  const { layers, layerIds, insertLayer, updateLayer, deleteLayer } =
    useLayerManagement(lastUsedColor);

  const findLayerAtPoint = useLayerHitDetection(layers, layerIds);

  useLayerRenderer(canvasRef, layers, layerIds, dimensions, selectedLayerId);

  const handleDelete = useCallback(() => {
    if (selectedLayerId) {
      deleteLayer(selectedLayerId);
      setSelectedLayerId(null);
    }
  }, [selectedLayerId, deleteLayer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayerId) {
        e.preventDefault();
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayerId, handleDelete]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const point = { x: e.clientX, y: e.clientY };

      if (canvasState.mode === CanvasMode.Inserting) {
        const layerId = insertLayer(canvasState.layerType, point);
        if (layerId) {
          drawingRef.current = { startPoint: point, layerId };
        }
      } else if (canvasState.mode === CanvasMode.None) {
        const layerId = findLayerAtPoint(point);

        if (layerId) {
          setSelectedLayerId(layerId);

          const layer = layers.get(layerId);

          if (layer) {
            if (
              layer.type === LayerType.Rectangle ||
              layer.type === LayerType.Circle
            ) {
              draggingRef.current = {
                layerId,
                offset: { x: point.x - layer.x, y: point.y - layer.y },
              };
            } else if (
              layer.type === LayerType.Line ||
              layer.type === LayerType.Arrow
            ) {
              draggingRef.current = {
                layerId,
                offset: { x: point.x - layer.x1, y: point.y - layer.y1 },
              };
            } else if (layer.type === LayerType.Pencil) {
              draggingRef.current = {
                layerId,
                offset: point,
              };
            }
            setCanvasState({ mode: CanvasMode.Translating, current: point });
          }
        } else {
          setSelectedLayerId(null);
        }
      }
    },
    [canvasState, insertLayer, findLayerAtPoint, layers]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const point = { x: e.clientX, y: e.clientY };

      if (drawingRef.current) {
        const { startPoint, layerId } = drawingRef.current;
        const layer = layers.get(layerId);

        if (layer) {
          if (
            layer.type === LayerType.Rectangle ||
            layer.type === LayerType.Circle
          ) {
            const width = point.x - startPoint.x;
            const height = point.y - startPoint.y;
            updateLayer(layerId, { width, height });
          } else if (
            layer.type === LayerType.Line ||
            layer.type === LayerType.Arrow
          ) {
            updateLayer(layerId, { x2: point.x, y2: point.y });
          } else if (layer.type === LayerType.Pencil) {
            updateLayer(layerId, {
              points: [...layer.points, point],
            });
          }
        }
      } else if (
        canvasState.mode === CanvasMode.Translating &&
        draggingRef.current
      ) {
        const { layerId, offset } = draggingRef.current;
        const layer = layers.get(layerId);

        if (layer) {
          if (
            layer.type === LayerType.Rectangle ||
            layer.type === LayerType.Circle
          ) {
            updateLayer(layerId, {
              x: point.x - offset.x,
              y: point.y - offset.y,
            });
          } else if (
            layer.type === LayerType.Line ||
            layer.type === LayerType.Arrow
          ) {
            const dx = point.x - offset.x;
            const dy = point.y - offset.y;
            updateLayer(layerId, {
              x1: dx,
              y1: dy,
              x2: layer.x2 + (dx - layer.x1),
              y2: layer.y2 + (dy - layer.y1),
            });
          } else if (layer.type === LayerType.Pencil) {
            const dx = point.x - offset.x;
            const dy = point.y - offset.y;

            const translatedPoints = layer.points.map((p) => ({
              x: p.x + dx,
              y: p.y + dy,
            }));

            updateLayer(layerId, { points: translatedPoints });

            draggingRef.current = {
              layerId,
              offset: point,
            };
          }
        }
        setCanvasState({ mode: CanvasMode.Translating, current: point });
      }
    },
    [canvasState, updateLayer, layers]
  );

  const handleMouseUp = useCallback(() => {
    if (drawingRef.current) {
      const { layerId } = drawingRef.current;
      const layer = layers.get(layerId);

      if (layer) {
        let shouldDelete = false;

        if (
          layer.type === LayerType.Rectangle ||
          layer.type === LayerType.Circle
        ) {
          shouldDelete =
            Math.abs(layer.width) < 5 && Math.abs(layer.height) < 5;
        } else if (
          layer.type === LayerType.Line ||
          layer.type === LayerType.Arrow
        ) {
          const dx = layer.x2 - layer.x1;
          const dy = layer.y2 - layer.y1;
          const length = Math.sqrt(dx * dx + dy * dy);
          shouldDelete = length < 5;
        } else if (layer.type === LayerType.Pencil) {
          shouldDelete = layer.points.length < 2;
        }

        if (shouldDelete) {
          deleteLayer(layerId);
        }
      }

      drawingRef.current = null;
    }

    if (draggingRef.current) {
      draggingRef.current = null;
    }

    if (canvasState.mode === CanvasMode.Translating) {
      setCanvasState({ mode: CanvasMode.None });
    }
  }, [canvasState, layers, deleteLayer]);

  return (
    <main className='h-screen w-screen relative overflow-hidden bg-gray-50'>
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        selectedLayerId={selectedLayerId}
        onDelete={handleDelete}
      />
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className='block cursor-crosshair'
      />
    </main>
  );
};

export default Canvas;
