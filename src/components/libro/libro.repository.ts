import { ILibro, Libro } from './libro.model';

export const libroRepository = {
  findAll: () => Libro.find().sort({ titulo: 1 }).exec(),
  findById: (id: string) => Libro.findById(id).exec(),
  create: (data: ILibro) => Libro.create(data),
  update: (id: string, data: ILibro) => Libro.findByIdAndUpdate(id,
    { $set: data }, { returnDocument: 'after', runValidators: true }).exec(),
  // La condición evita borrar un libro prestado incluso si cambió entre consultas.
  deleteAvailable: (id: string) => Libro.findOneAndDelete({ _id: id, disponible: true }).exec(),
};
