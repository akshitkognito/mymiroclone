import { useState, useCallback } from 'react';
import { shapeService } from '@/services';
import { BackendShape, ShapesResponse } from '@/types/api';
import { ApiError } from '@/services/api.config';

interface UseShapeServiceReturn {
  loading: boolean;
  error: string | null;
  getAllShapes: (pageId?: string) => Promise<ShapesResponse | null>;
  getShapeById: (id: string) => Promise<BackendShape | null>;
  createShape: (shape: BackendShape) => Promise<BackendShape | null>;
  updateShape: (
    id: string,
    updates: Partial<BackendShape>
  ) => Promise<BackendShape | null>;
  deleteShape: (id: string) => Promise<BackendShape | null>;
  deleteAllShapes: (pageId: string) => Promise<number | null>;
  clearError: () => void;
}

export const useShapeService = (): UseShapeServiceReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getAllShapes = useCallback(
    async (pageId?: string): Promise<ShapesResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await shapeService.getAllShapes(pageId);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : 'Failed to fetch shapes';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getShapeById = useCallback(
    async (id: string): Promise<BackendShape | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await shapeService.getShapeById(id);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : 'Failed to fetch shape';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createShape = useCallback(
    async (shape: BackendShape): Promise<BackendShape | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await shapeService.createShape(shape);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : 'Failed to create shape';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateShape = useCallback(
    async (
      id: string,
      updates: Partial<BackendShape>
    ): Promise<BackendShape | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await shapeService.updateShape(id, updates);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : 'Failed to update shape';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteShape = useCallback(
    async (id: string): Promise<BackendShape | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await shapeService.deleteShape(id);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : 'Failed to delete shape';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAllShapes = useCallback(
    async (pageId: string): Promise<number | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await shapeService.deleteAllShapes(pageId);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof ApiError ? err.message : 'Failed to delete shapes';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    getAllShapes,
    getShapeById,
    createShape,
    updateShape,
    deleteShape,
    deleteAllShapes,
    clearError,
  };
};
