import { TUser } from '@common/types';
import { Schema, model } from 'mongoose';

export const UserSchema = new Schema<TUser>(
  {
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

const UserModel = model<TUser>('User', UserSchema);

export default UserModel;
