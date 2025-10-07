import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateCommentInput, UpdateCommentInput, GetCommentInput, DeleteCommentInput, GetAllCommentsInput } from '../schemas/comment.schema';

const prisma = new PrismaClient();

export class CommentController {
  // GET /comments - Listar todos os comentários
  static async getAllComments(req: Request<{}, {}, {}, GetAllCommentsInput['query']>, res: Response) {
    try {
      const { page = 1, limit = 10, postId } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const whereClause: any = {};
      if (postId) {
        whereClause.postId = Number(postId);
      }

      const [comments, total] = await Promise.all([
        prisma.comment.findMany({
          where: whereClause,
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
          include: {
            post: true
          }
        }),
        prisma.comment.count({ where: whereClause })
      ]);

      res.json({
        success: true,
        data: comments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar comentários',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // GET /comments/:id - Buscar comentário por ID
  static async getCommentById(req: Request<GetCommentInput['params']>, res: Response) {
    try {
      const { id } = req.params;

      const comment = await prisma.comment.findUnique({
        where: { id: Number(id) },
        include: {
          post: true
        }
      });

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Comentário não encontrado'
        });
      }

      res.json({
        success: true,
        data: comment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar comentário',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // POST /comments - Criar novo comentário
  static async createComment(req: Request<{}, {}, CreateCommentInput['body']>, res: Response) {
    try {
      const { content, postId } = req.body;

      // Verificar se o post existe
      const post = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado'
        });
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          postId
        }
      });

      res.status(201).json({
        success: true,
        data: comment,
        message: 'Comentário criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar comentário',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // PUT /comments/:id - Atualizar comentário
  static async updateComment(req: Request<UpdateCommentInput['params'], {}, UpdateCommentInput['body']>, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const comment = await prisma.comment.update({
        where: { id: Number(id) },
        data: updateData
      });

      res.json({
        success: true,
        data: comment,
        message: 'Comentário atualizado com sucesso'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Record to update not found')) {
        return res.status(404).json({
          success: false,
          message: 'Comentário não encontrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar comentário',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // DELETE /comments/:id - Deletar comentário
  static async deleteComment(req: Request<DeleteCommentInput['params']>, res: Response) {
    try {
      const { id } = req.params;

      await prisma.comment.delete({
        where: { id: Number(id) }
      });

      res.json({
        success: true,
        message: 'Comentário deletado com sucesso'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
        return res.status(404).json({
          success: false,
          message: 'Comentário não encontrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao deletar comentário',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}
