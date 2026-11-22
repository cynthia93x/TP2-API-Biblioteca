import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { isObjectIdOrHexString } from 'mongoose';
import { env } from '../config/env';
import { AppError } from '../shared/app-error';

export const requireAuth: RequestHandler = (req, _res, next) => {
  const match = req.headers.authorization?.match(/^Bearer\s+(\S+)$/i);
  if (!match) {
    next(new AppError(401, 'Debés enviar Authorization: Bearer <token>'));
    return;
  }
  try {
    const payload = jwt.verify(match[1], env.jwtSecret, {
      algorithms: ['HS256'],
      issuer: 'biblioteca-api',
    });
    if (typeof payload === 'string' || !payload.sub || !isObjectIdOrHexString(payload.sub)) {
      throw new Error('Payload inválido');
    }
    next();
  } catch {
    next(new AppError(401, 'Token inválido o vencido'));
  }
};
