import express from 'express';
import {
  createShape,
  deleteAllShapes,
  deleteShapeById,
  getAllShapes,
  getShapeById,
  updateShapeById,
} from '../controllers/shape.controllers';

const shapeRouter = express.Router();

shapeRouter.get('/', getAllShapes);
shapeRouter.get('/:id', getShapeById);

shapeRouter.post('/', createShape);

shapeRouter.put('/:id', updateShapeById);

shapeRouter.delete('/', deleteAllShapes);
shapeRouter.delete('/:id', deleteShapeById);

export default shapeRouter;
