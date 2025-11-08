import {
  ApiResponse,
  ShapeDto,
  ShapesResponseDto,
  Layer,
} from '@/types/canvas';
import { layerToShapeDto, shapeDtoToLayer } from '@/utils/elementFactory';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const CONFIGURED_API_URL = `${API_BASE_URL}/api/v1/shapes`;

export const shapeService = {
  getAllShapes: async (pageId: string = 'default'): Promise<Layer[]> => {
    try {
      const response = await fetch(`${CONFIGURED_API_URL}?pageId=${pageId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch shapes: ${response.statusText}`);
      }
      const data: ApiResponse<ShapesResponseDto> = await response.json();

      if (data.success && data.data) {
        return data.data.shapes
          .map(shapeDtoToLayer)
          .filter((layer): layer is Layer => layer !== null);
      }
      return [];
    } catch (error) {
      console.error('Error fetching shapes:', error);
      return [];
    }
  },

  getShapeById: async (id: string): Promise<Layer | null> => {
    try {
      const response = await fetch(`${CONFIGURED_API_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch shape: ${response.statusText}`);
      }
      const data: ApiResponse<ShapeDto> = await response.json();

      if (data.success && data.data) {
        return shapeDtoToLayer(data.data);
      }
      return null;
    } catch (error) {
      console.error('Error fetching shape:', error);
      return null;
    }
  },

  createShape: async (
    layer: Layer,
    pageId: string = 'default'
  ): Promise<string | null> => {
    try {
      const shapeData = layerToShapeDto(layer, pageId);

      const response = await fetch(CONFIGURED_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shapeData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create shape: ${response.statusText}`);
      }

      const data: ApiResponse<ShapeDto> = await response.json();

      if (data.success && data.data) {
        return data.data.id;
      }
      return null;
    } catch (error) {
      console.error('Error creating shape:', error);
      return null;
    }
  },

  updateShape: async (
    id: string,
    layer: Layer,
    pageId: string = 'default'
  ): Promise<boolean> => {
    try {
      const shapeData = layerToShapeDto(layer, pageId);

      const response = await fetch(`${CONFIGURED_API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shapeData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update shape: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error updating shape:', error);
      return false;
    }
  },

  deleteShape: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${CONFIGURED_API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete shape: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error deleting shape:', error);
      return false;
    }
  },

  deleteAllShapes: async (): Promise<boolean> => {
    try {
      const response = await fetch(CONFIGURED_API_URL, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete all shapes: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error deleting all shapes:', error);
      return false;
    }
  },
};
