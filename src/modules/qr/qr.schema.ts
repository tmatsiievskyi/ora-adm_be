import { object, string, TypeOf } from 'zod';

const payload = {
  body: object({
    url: string({
      required_error: 'URL is required',
    }),
  }),
};

export const generateQRSchema = object({
  ...payload,
});

export type TGenerateQRInput = TypeOf<typeof generateQRSchema>;
