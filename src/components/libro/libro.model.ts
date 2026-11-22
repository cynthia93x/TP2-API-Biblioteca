import { Schema, model } from 'mongoose';

export const GENEROS = ['novela', 'cuento', 'poesia', 'ensayo', 'ciencia', 'historia', 'otro'] as const;
export type Genero = typeof GENEROS[number];

export interface ILibro {
  titulo: string;
  autor: string;
  anio: number;
  genero: Genero;
  disponible: boolean;
}

const libroSchema = new Schema<ILibro>({
  titulo: { type: String, required: true, trim: true, minlength: 2, maxlength: 200 },
  autor: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
  anio: { type: Number, required: true, min: 1 },
  genero: { type: String, required: true, enum: GENEROS },
  disponible: { type: Boolean, required: true },
}, { timestamps: true, versionKey: false });

export const Libro = model<ILibro>('Libro', libroSchema);
