import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import shapeRouter from './routes/shape.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1/shapes', shapeRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

app.listen(PORT, () => {
  console.log(`*****Server started at ${PORT}*****`);
});
