import { TRefreshToken } from '@common/types';
import { Schema, model } from 'mongoose';

export const RefreshTokenSchema = new Schema<TRefreshToken>(
  {
    login: { type: String, required: true, unique: true },
    token: { type: String, required: true },
  },
  { timestamps: true },
);
const RefreshTokenModel = model<TRefreshToken>(
  'RefreshToken',
  RefreshTokenSchema,
);

export default RefreshTokenModel;
