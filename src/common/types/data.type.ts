import { FilterQuery, Types } from 'mongoose';

export type TMongoDefault = {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type TFilterQuery<T> = {} & FilterQuery<T>;

export type TUser = {
  login: string;
  password: string;
  isVerified: boolean;
} & TMongoDefault;

export type TLocal = {
  lng: string;
  key: string;
  value: string;
};

export type TRefreshToken = {
  login: string;
  token: string;
} & TMongoDefault;

export type TEmployee = {
  firstName: string;
  lastName: string;
  surname: string;
  imgUrl: string;
  smImgUrl: string;
  position: string;
  department: string;
  index: number;
  illness?: string[];
  achievements?: string[];
} & TMongoDefault;

export type TSubservice = {
  label: string;
  category?: string;
  service?: Types.ObjectId | string;
  serviceName?: string;
  subCategory?: string;
  outsource: boolean;
  description?: string;
  price: number;
  pricePrefix?: string;
  priceSuffix?: string;
  archived?: boolean;
  searchTags?: string[]; //TODO: remove
  index?: number;
} & TMongoDefault; // TODO: remove ?

export type TService = {
  name: string;
  label: string;
  description: string;
  shortDescription?: string;
  imgUrl: string;
  employee: Types.ObjectId[];
  subService: Types.ObjectId[];
  subServices: Types.ObjectId[];
  mainItems?: string;
  index: number;
} & TMongoDefault;
