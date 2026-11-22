import mongoose from 'mongoose';
import { env } from './env';
import { User } from '../components/user/user.model';

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
  // Espera la creación del índice único de email antes de aceptar registros.
  await User.init();
  console.log('MongoDB conectado');
}
