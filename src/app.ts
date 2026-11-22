import express from 'express';
import { authRouter } from './components/auth/auth.routes';
import { libroRouter } from './components/libro/libro.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { AppError } from './shared/app-error';

export const app = express();
app.use(express.json({ limit: '100kb' }));
app.use('/api/auth', authRouter);
app.use('/api/libros', libroRouter);
app.use((_req, _res, next) => next(new AppError(404, 'Ruta no encontrada')));
app.use(errorMiddleware);
