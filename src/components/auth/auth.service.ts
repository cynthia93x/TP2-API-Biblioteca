import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../shared/app-error';
import { objectBody, onlyFields, text } from '../../shared/validation';
import { userRepository } from '../user/user.repository';

function credentials(body: Record<string, unknown>, registering: boolean) {
  const email = text(body.email, 'email', 3, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError(400, 'El email no es válido');
  }
  const password = body.password;
  // No usar trim(): los espacios pueden formar parte de la contraseña.
  if (typeof password !== 'string' || password.length < (registering ? 8 : 1) ||
      Buffer.byteLength(password, 'utf8') > 72) {
    throw new AppError(400, registering
      ? 'La contraseña debe tener al menos 8 caracteres y como máximo 72 bytes'
      : 'La contraseña es obligatoria y no puede superar los 72 bytes');
  }
  return { email, password };
}

export const authService = {
  async register(input: unknown) {
    const body = objectBody(input);
    onlyFields(body, ['nombre', 'email', 'password']);
    const nombre = text(body.nombre, 'nombre', 2, 100);
    const { email, password } = credentials(body, true);
    if (await userRepository.findByEmail(email)) {
      throw new AppError(400, 'Ya existe un usuario con ese email');
    }
    const hash = await bcrypt.hash(password, 12);
    const user = await userRepository.create({ nombre, email, password: hash });
    return { id: user._id, nombre: user.nombre, email: user.email };
  },

  async login(input: unknown) {
    const body = objectBody(input);
    onlyFields(body, ['email', 'password']);
    const { email, password } = credentials(body, false);
    const user = await userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError(401, 'Email o contraseña incorrectos');
    }
    const token = jwt.sign({}, env.jwtSecret, {
      subject: user._id.toString(),
      expiresIn: '1h',
      algorithm: 'HS256',
      issuer: 'biblioteca-api',
    });
    return {
      token,
      user: { id: user._id, nombre: user.nombre, email: user.email },
    };
  },
};
