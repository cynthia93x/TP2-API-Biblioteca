import { isObjectIdOrHexString } from 'mongoose';
import { AppError } from './app-error';

export function objectBody(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new AppError(400, 'El cuerpo debe ser un objeto JSON');
  }
  return value as Record<string, unknown>;
}

export function onlyFields(body: Record<string, unknown>, fields: string[]): void {
  if (Object.keys(body).some((key) => !fields.includes(key))) {
    throw new AppError(400, 'El cuerpo contiene campos no permitidos');
  }
}

export function text(value: unknown, field: string, min = 1, max = 200): string {
  if (typeof value !== 'string') {
    throw new AppError(400, `${field} debe ser un texto`);
  }
  const result = value.trim();
  if (result.length < min || result.length > max) {
    throw new AppError(400, `${field} debe tener entre ${min} y ${max} caracteres`);
  }
  return result;
}

export function objectId(value: unknown): string {
  if (typeof value !== 'string' || !isObjectIdOrHexString(value)) {
    throw new AppError(400, 'El id debe ser un ObjectId válido de MongoDB');
  }
  return value;
}
