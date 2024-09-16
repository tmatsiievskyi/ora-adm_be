import { TEmployee } from '@common/types';
import { model, Schema } from 'mongoose';

export const EmployeeSchema = new Schema<TEmployee>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    surname: { type: String, required: true },
    imgUrl: { type: String, required: true },
    smImgUrl: { type: String, required: true },
    position: { type: String, required: true },
    index: { type: Number, required: true },
    department: { type: String, required: true },
    illness: { type: [String], required: false },
    achievements: { type: [String], required: false },
  },
  { timestamps: true },
);

const EmployeeModel = model<TEmployee>('Employee', EmployeeSchema);

export default EmployeeModel;
