import { Schema, model } from 'mongoose';

export interface IUser {
  nombre: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  nombre: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
}, { timestamps: true, versionKey: false });

export const User = model<IUser>('User', userSchema);
