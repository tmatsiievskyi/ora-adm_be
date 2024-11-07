import { TLocal } from '@common/types';
import { model, Schema } from 'mongoose';

export const LocalizationSchema = new Schema<TLocal>({
  lng: { type: String, required: true },
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const LocalizationModel = model<TLocal>('Localization', LocalizationSchema);

export default LocalizationModel;
