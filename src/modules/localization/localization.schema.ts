import { object, string, TypeOf } from 'zod';

export const findLocalizationJsonSchema = object({
  query: object({
    lng: string({
      required_error: 'Language is required',
    }),
  }),
});

export type TFindAllLocalizationInput = TypeOf<
  typeof findLocalizationJsonSchema
>;
