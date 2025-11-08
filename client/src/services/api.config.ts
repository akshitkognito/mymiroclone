export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const API_VERSION = 'v1';

export const API_ENDPOINTS = {
  SHAPES: `/api/${API_VERSION}/shapes`,
} as const;

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
