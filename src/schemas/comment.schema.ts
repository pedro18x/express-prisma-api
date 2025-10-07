import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Conteúdo é obrigatório'),
    postId: z.number().positive('ID do post deve ser um número positivo')
  })
});

export const updateCommentSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val)).pipe(z.number().positive('ID deve ser um número positivo'))
  }),
  body: z.object({
    content: z.string().min(1, 'Conteúdo é obrigatório').optional()
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser fornecido para atualização'
  })
});

export const getCommentSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val)).pipe(z.number().positive('ID deve ser um número positivo'))
  })
});

export const deleteCommentSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val)).pipe(z.number().positive('ID deve ser um número positivo'))
  })
});

export const getAllCommentsSchema = z.object({
  query: z.object({
    postId: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
    page: z.string().optional().transform((val) => parseInt(val) || 1),
    limit: z.string().optional().transform((val) => parseInt(val) || 10)
  }).optional()
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type GetCommentInput = z.infer<typeof getCommentSchema>;
export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>;
export type GetAllCommentsInput = z.infer<typeof getAllCommentsSchema>;
