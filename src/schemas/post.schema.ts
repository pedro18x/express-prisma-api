import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Título é obrigatório').max(200, 'Título deve ter no máximo 200 caracteres'),
    content: z.string().min(1, 'Conteúdo é obrigatório'),
    published: z.boolean().optional().default(false),
    authorId: z.number().positive('ID do autor deve ser um número positivo')
  })
});

export const updatePostSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val)).pipe(z.number().positive('ID deve ser um número positivo'))
  }),
  body: z.object({
    title: z.string().min(1, 'Título é obrigatório').max(200, 'Título deve ter no máximo 200 caracteres').optional(),
    content: z.string().min(1, 'Conteúdo é obrigatório').optional(),
    published: z.boolean().optional(),
    authorId: z.number().positive('ID do autor deve ser um número positivo').optional()
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser fornecido para atualização'
  })
});

export const getPostSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val)).pipe(z.number().positive('ID deve ser um número positivo'))
  }),
  query: z.object({
    include: z.string().optional().transform((val) => val === 'true')
  }).optional()
});

export const deletePostSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val)).pipe(z.number().positive('ID deve ser um número positivo'))
  })
});

export const getAllPostsSchema = z.object({
  query: z.object({
    include: z.string().optional().transform((val) => val === 'true'),
    published: z.string().optional().transform((val) => val === 'true'),
    page: z.string().optional().transform((val) => parseInt(val) || 1),
    limit: z.string().optional().transform((val) => parseInt(val) || 10)
  }).optional()
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type GetPostInput = z.infer<typeof getPostSchema>;
export type DeletePostInput = z.infer<typeof deletePostSchema>;
export type GetAllPostsInput = z.infer<typeof getAllPostsSchema>;
