import { ApiResponse, BackendShape, ShapesResponse } from '@/types/api';
import { API_BASE_URL, API_ENDPOINTS, ApiError } from './api.config';

class ShapeService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}${API_ENDPOINTS.SHAPES}`;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new ApiError(
        data.error || 'An error occurred',
        response.status,
        data.details
      );
    }

    return data.data as T;
  }

  async getAllShapes(pageId?: string): Promise<ShapesResponse> {
    try {
      const url = pageId
        ? `${this.baseUrl}?pageId=${encodeURIComponent(pageId)}`
        : this.baseUrl;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse<ShapesResponse>(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch shapes');
    }
  }

  async getShapeById(id: string): Promise<BackendShape> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await this.handleResponse<{ shape: BackendShape }>(response);
      return data.shape;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch shape');
    }
  }

  async createShape(shape: BackendShape): Promise<BackendShape> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shape),
      });

      const data = await this.handleResponse<{ shape: BackendShape }>(response);
      return data.shape;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create shape');
    }
  }

  async updateShape(
    id: string,
    updates: Partial<BackendShape>
  ): Promise<BackendShape> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await this.handleResponse<{ shape: BackendShape }>(response);
      return data.shape;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update shape');
    }
  }

  async deleteShape(id: string): Promise<BackendShape> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await this.handleResponse<{ shape: BackendShape }>(response);
      return data.shape;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete shape');
    }
  }

  async deleteAllShapes(pageId: string): Promise<number> {
    try {
      const response = await fetch(
        `${this.baseUrl}?pageId=${encodeURIComponent(pageId)}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await this.handleResponse<{ deletedCount: number }>(response);
      return data.deletedCount;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete shapes');
    }
  }
}

export const shapeService = new ShapeService();
