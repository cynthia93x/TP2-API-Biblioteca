import { IUser, User } from './user.model';

export const userRepository = {
  findByEmail: (email: string) => User.findOne({ email }).select('+password').exec(),
  create: (data: IUser) => User.create(data),
};
