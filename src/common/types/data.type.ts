import { Types } from 'mongoose';

export type TMongoDefault = {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type TUser = {
  login: string;
  password: string;
} & TMongoDefault;

export type TRefreshToken = {
  login: string;
  token: string;
} & TMongoDefault;
