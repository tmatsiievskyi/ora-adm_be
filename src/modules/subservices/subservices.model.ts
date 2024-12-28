import { TSubservice } from '@common/types';
import { Schema, Types, model } from 'mongoose';

export const SubServiceSchema = new Schema<TSubservice>({
  label: { type: String, required: true, unique: true },
  category: { type: String, required: false },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  serviceName: { type: String, required: false },
  subCategory: { type: String, required: false },
  outsource: { type: Boolean, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  pricePrefix: { type: String, required: false },
  priceSuffix: { type: String, required: false },
  archived: { type: Boolean, required: false },
  searchTags: { type: [String], required: false },
  index: { type: Number, required: true },
});

const SubserviceModel = model<TSubservice>('SubService', SubServiceSchema);

export default SubserviceModel;
