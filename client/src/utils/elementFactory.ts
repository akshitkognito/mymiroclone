import { Color } from '@/types/canvas';

export const colorToString = (color: Color) =>
  `rgb(${color.r}, ${color.g}, ${color.b})`;

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const MAX_LAYERS = 100;
