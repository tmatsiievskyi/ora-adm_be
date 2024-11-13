import { object, string, TypeOf } from 'zod';

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

export type TFindAllSubservicesInput = TypeOf<typeof findAllSubservicesSchema>;
