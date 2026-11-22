import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../shared/app-error';

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: 'Los datos enviados no son válidos' });
    return;
  }
  if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
    res.status(400).json({ message: 'Ya existe un usuario con ese email' });
    return;
  }
  if (error && typeof error === 'object' && 'type' in error && error.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'El JSON enviado no es válido' });
    return;
  }
  if (error && typeof error === 'object' && 'type' in error && error.type === 'entity.too.large') {
    res.status(413).json({ message: 'El cuerpo de la solicitud es demasiado grande' });
    return;
  }
  console.error('Error interno:', error);
  res.status(500).json({ message: 'Error interno del servidor' });
};
