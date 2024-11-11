import { TSubservice } from '@common/types';
import { Schema, model } from 'mongoose';

export const SubServiceSchema = new Schema<TSubservice>({
  label: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: false },
  outsource: { type: Boolean, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  searchTags: { type: [String], required: false },
  index: { type: Number, required: true },
});

const SubserviceModel = model<TSubservice>('Subservice', SubServiceSchema);

export default SubserviceModel;
