import { app } from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';

async function start(): Promise<void> {
  await connectDatabase();
  const server = app.listen(env.port, () => {
    console.log(`API disponible en http://localhost:${env.port}`);
  });
  server.on('error', (error) => {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  });
}

start().catch(() => {
  console.error('No se pudo conectar a MongoDB. Revisá MONGO_URI, usuario e IP autorizada.');
  process.exit(1);
});
