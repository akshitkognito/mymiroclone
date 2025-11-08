export const isValidShape = (shape: any): boolean => {
  if (!shape || typeof shape !== 'object') return false;
  if (!shape.id || typeof shape.id !== 'string') return false;
  if (!shape.pageId || typeof shape.pageId !== 'string') return false;
  if (!['rectangle', 'square', 'line', 'arrow', 'text'].includes(shape.type))
    return false;
  if (typeof shape.x !== 'number' || typeof shape.y !== 'number') return false;

  switch (shape.type) {
    case 'rectangle':
    case 'square':
      return (
        typeof shape.width === 'number' && typeof shape.height === 'number'
      );

    case 'line':
    case 'arrow':
      return (
        typeof shape.width === 'number' && typeof shape.height === 'number'
      );

    case 'text':
      return (
        typeof shape.content === 'string' &&
        typeof shape.fontSize === 'number' &&
        typeof shape.fontFamily === 'string'
      );

    default:
      return false;
  }
};
