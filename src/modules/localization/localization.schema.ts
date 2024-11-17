import { object, string, TypeOf } from 'zod';

export const createLocalPayload = {
  body: object({
    lng: string({
      required_error: 'lng is required',
    }),
    key: string({
      required_error: 'key is required',
    }),
    value: string({
      required_error: 'value is required',
    }),
  }),
};

export const findLocalizationJsonSchema = object({
  query: object({
    lng: string({
      required_error: 'Language is required',
    }),
  }),
});

export const createLocalSchema = object({
  ...createLocalPayload,
});

export type TFindAllLocalizationInput = TypeOf<
  typeof findLocalizationJsonSchema
>;
export type TCreateLocalInput = TypeOf<typeof createLocalSchema>;
