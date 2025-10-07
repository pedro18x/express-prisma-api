import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Email deve ter um formato válido'),
    name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres')
  })
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val)).pipe(z.number().positive('ID deve ser um número positivo'))
  }),
  body: z.object({
    email: z.string().email('Email deve ter um formato válido').optional(),
    name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres').optional()
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser fornecido para atualização'
  })
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val)).pipe(z.number().positive('ID deve ser um número positivo'))
  })
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val)).pipe(z.number().positive('ID deve ser um número positivo'))
  })
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserInput = z.infer<typeof getUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
