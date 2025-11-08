import { Request, Response } from 'express';
import { ApiResponse, Shape, ShapesResponse } from '../types/shape';

const shapes = new Map<string, Shape | null>();
let shapeIds: string[] = [];

export const getAllShapes = (req: Request, res: Response) => {
  try {
    const { pageId } = req.query;

    let allShapes = shapeIds
      .map((id) => shapes.get(id))
      .filter((shape): shape is Shape => shape !== undefined);

    if (pageId && typeof pageId === 'string') {
      allShapes = allShapes.filter((shape) => shape.pageId === pageId);
    }

    const response: ApiResponse<ShapesResponse> = {
      success: true,
      data: {
        shapes: allShapes,
        count: allShapes.length,
      },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch shapes',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

export const getShapeById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!shapes.has(id)) {
      const response: ApiResponse = {
        success: false,
        error: 'Shape not found',
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<{ shape: Shape }> = {
      success: true,
      data: { shape: shapes.get(id)! },
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch shape',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

export const createShape = (req: Request, res: Response) => {
  try {
    const shape = req.body;

    if (shapes.has(shape.id)) {
      const response: ApiResponse = {
        success: false,
        error: 'Shape with this ID already exists',
      };
      return res.status(409).json(response);
    }

    shapes.set(shape.id, shape);
    shapeIds.push(shape.id);

    const response: ApiResponse<{ shape: Shape }> = {
      success: true,
      data: { shape },
      message: 'Shape created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create shape',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

export const updateShapeById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!shapes.has(id)) {
      const response: ApiResponse = {
        success: false,
        error: 'Shape not found',
      };
      return res.status(404).json(response);
    }

    const existingShape = shapes.get(id);

    let updatedShape: Shape | null = null;

    if (existingShape) {
      updatedShape = {
        ...existingShape,
        ...updates,
        id: existingShape.id,
        pageId: existingShape.pageId,
        // Explicitly handle all shape-specific properties
        x: updates.x !== undefined ? updates.x : existingShape.x,
        y: updates.y !== undefined ? updates.y : existingShape.y,
        points:
          updates.points !== undefined ? updates.points : existingShape.points,
        width:
          updates.width !== undefined ? updates.width : existingShape.width,
        height:
          updates.height !== undefined ? updates.height : existingShape.height,
      };
    }

    shapes.set(id, updatedShape || null);

    const response: ApiResponse<{ shape: Shape | null }> = {
      success: true,
      data: { shape: updatedShape },
      message: 'Shape updated successfully',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update shape',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

export const deleteShapeById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!shapes.has(id)) {
      const response: ApiResponse = {
        success: false,
        error: 'Shape not found',
      };
      return res.status(404).json(response);
    }

    const deletedShape = shapes.get(id)!;
    shapes.delete(id);
    shapeIds = shapeIds.filter((shapeId) => shapeId !== id);

    const response: ApiResponse<{ shape: Shape | null }> = {
      success: true,
      data: { shape: deletedShape },
      message: 'Shape deleted successfully',
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete shape',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

export const deleteAllShapes = (req: Request, res: Response) => {
  try {
    const { pageId } = req.query;

    if (!pageId || typeof pageId !== 'string') {
      const response: ApiResponse = {
        success: false,
        error: 'pageId query parameter is required',
      };
      return res.status(400).json(response);
    }

    const deletedShapes: Shape[] = [];
    shapeIds = shapeIds.filter((id) => {
      const shape = shapes.get(id);
      if (shape && shape.pageId === pageId) {
        deletedShapes.push(shape);
        shapes.delete(id);
        return false;
      }
      return true;
    });

    const response: ApiResponse<{ deletedCount: number }> = {
      success: true,
      data: { deletedCount: deletedShapes.length },
      message: `Deleted ${deletedShapes.length} shapes from page ${pageId}`,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete shapes',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};
