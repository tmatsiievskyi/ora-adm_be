import { object, string, TypeOf, number, array } from 'zod';

const payload = {
  body: object({
    firstName: string({
      required_error: 'firstName is required',
    }),
    lastName: string({
      required_error: 'lastName is required',
    }),
    surname: string({
      required_error: 'surname is required',
    }),
    imgUrl: string({
      required_error: 'imgUrl is required',
    }),
    smImgUrl: string({
      required_error: 'smImgUrl is required',
    }),
    position: string({
      required_error: 'position is required',
    }),
    index: number({
      required_error: 'index is required',
    }),
    department: string({
      required_error: 'department is required',
    }),
    illness: string({
      required_error: 'illness is required',
    }).array(),
    achievements: string({
      required_error: 'Value should be presented',
    }).array(),
  }),
};

const params = {
  params: object({
    id: string({
      required_error: 'Id is required',
    }),
  }),
};

export const createEmployeeSchema = object({
  ...payload,
});

export const findAllEmployeesSchema = object({
  query: object({
    page: string({
      required_error: 'Page is required',
    }).optional(),
    pageSize: string({
      required_error: 'Page size is required',
    }).optional(),
  }).nullable(),
});

export const findByIdEmployeeSchema = object({
  params: object({
    id: string({
      required_error: 'Id param is required',
    }),
  }),
});

export const deleteByIdEmployeeSchema = object({
  ...params,
});

export const updateByIdEmployeeSchema = object({
  ...payload,
  ...params,
});

export type FindAllEmployeesInput = TypeOf<typeof findAllEmployeesSchema>;
export type FindByIdEmployeeInput = TypeOf<typeof findByIdEmployeeSchema>;
export type CreateEmployeeInput = TypeOf<typeof createEmployeeSchema>;
export type TDeleteByIdEmplyeeInput = TypeOf<typeof deleteByIdEmployeeSchema>;
export type TUpdateByIdEmployeeInput = TypeOf<typeof updateByIdEmployeeSchema>;
