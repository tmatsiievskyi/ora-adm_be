import { OmitBy } from '@common/types/helpers';
import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    login: string({
      required_error: 'Login is required',
    }),
    password: string({
      required_error: 'Password is required',
    }),
    passwordConfirm: string({
      required_error: 'Confirm Password is required',
    }),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: 'Password do not match',
    path: ['passwordConfirm'],
  }),
});

export const loginUserSchema = object({
  body: object({
    login: string({
      required_error: 'Login is required',
    }),
    password: string({
      required_error: 'Password is required',
    }),
  }),
});

export type CreateUserInput = OmitBy<
  TypeOf<typeof createUserSchema>,
  ['body', 'passwordConfirm']
>;

export type LoginUserInput = TypeOf<typeof loginUserSchema>;
