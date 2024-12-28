import { TService } from '@common/types';
import { Schema, model } from 'mongoose';

export const ServiceSchema = new Schema<TService>({
  name: { type: String, required: true, unique: true },
  label: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: false },
  imgUrl: { type: String, required: true },
  employee: [{ type: Schema.Types.ObjectId, ref: 'Employee', required: false }],
  subServices: [
    { type: Schema.Types.ObjectId, ref: 'SubService', required: false },
  ],
  mainItems: { type: [String], required: false },
  index: { type: Number, required: true },
});

const ServiceModel = model<TService>('Service', ServiceSchema);

export default ServiceModel;
