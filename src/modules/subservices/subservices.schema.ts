import { boolean, object, string, TypeOf, number, array } from 'zod';
import { createLocalPayload } from '../localization/localization.schema';

const createSubservicePayload = {
  //TODO: remove optional and migrate
  body: object({
    subservice: object({
      label: string({
        required_error: 'label is required',
      }),
      category: string({
        required_error: 'subCategory is required',
      }),
      subCategory: string().optional(),
      outsource: boolean({
        required_error: 'outsource is required',
      }),
      description: string().optional(),
      price: number({
        required_error: 'price is required',
      }),
      searchTags: array(string()).optional(),
      index: number(),
    }),
    localizations: array(createLocalPayload.body),
  }),
};

const paramsId = {
  params: object({
    id: string({
      required_error: 'Id is required',
    }),
  }),
};

export const findAllSubservicesSchema = object({
  query: object({
    search: string().optional(),
    page: string().optional(),
    limit: string().optional(),
    sortField: string().optional(),
    sortOrder: string().optional(),
    lng: string().optional(),
  }),
});

// export const createSubserviceSchema = object({
//   body: {
//     subservice: payloadSubservice
//   }
// });

export const createSubserviceSchema = object({
  ...createSubservicePayload,
});

export const updateSubserviceByIdSchema = object({
  ...paramsId,
  ...createSubservicePayload,
});

export type TFindAllSubservicesInput = TypeOf<typeof findAllSubservicesSchema>;
export type TUpdateSubserviceById = TypeOf<typeof updateSubserviceByIdSchema>;
export type TCreateSubserviceSchema = TypeOf<typeof createSubserviceSchema>;
