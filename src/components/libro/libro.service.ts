import { AppError } from '../../shared/app-error';
import { objectBody, objectId, onlyFields, text } from '../../shared/validation';
import { GENEROS, Genero, ILibro } from './libro.model';
import { libroRepository } from './libro.repository';

function validateLibro(input: unknown): ILibro {
  const body = objectBody(input);
  onlyFields(body, ['titulo', 'autor', 'anio', 'genero', 'disponible']);
  const titulo = text(body.titulo, 'titulo', 2, 200);
  const autor = text(body.autor, 'autor', 2, 150);
  const anio = body.anio;
  const currentYear = new Date().getFullYear();
  // Regla de negocio 1: solo libros publicados, sin años futuros o no positivos.
  if (typeof anio !== 'number' || !Number.isInteger(anio) || anio < 1 || anio > currentYear) {
    throw new AppError(400, `anio debe ser un entero entre 1 y ${currentYear}`);
  }
  const genero = text(body.genero, 'genero', 1, 30).toLowerCase();
  // Regla de negocio 2: el catálogo usa estos géneros.
  if (!GENEROS.includes(genero as Genero)) {
    throw new AppError(400, `genero debe ser uno de: ${GENEROS.join(', ')}`);
  }
  if (typeof body.disponible !== 'boolean') {
    throw new AppError(400, 'disponible debe ser true o false, sin comillas');
  }
  return { titulo, autor, anio, genero: genero as Genero, disponible: body.disponible };
}

export const libroService = {
  getAll: () => libroRepository.findAll(),

  async getById(id: unknown) {
    const libro = await libroRepository.findById(objectId(id));
    if (!libro) throw new AppError(404, 'Libro no encontrado');
    return libro;
  },

  create: (input: unknown) => libroRepository.create(validateLibro(input)),

  async update(id: unknown, input: unknown) {
    const validId = objectId(id);
    const data = validateLibro(input);
    const libro = await libroRepository.update(validId, data);
    if (!libro) throw new AppError(404, 'Libro no encontrado');
    return libro;
  },

  async delete(id: unknown) {
    const validId = objectId(id);
    const libro = await libroRepository.findById(validId);
    if (!libro) throw new AppError(404, 'Libro no encontrado');
    // Regla de negocio 3: no dar de baja libros que están prestados.
    if (!libro.disponible) throw new AppError(400, 'No se puede eliminar un libro prestado');
    const deleted = await libroRepository.deleteAvailable(validId);
    if (!deleted) throw new AppError(400, 'El libro cambió o ya fue eliminado; volvé a consultar');
    return { message: 'Libro eliminado' };
  },
};
