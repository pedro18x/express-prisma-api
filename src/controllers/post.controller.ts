import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreatePostInput, UpdatePostInput, GetPostInput, DeletePostInput, GetAllPostsInput } from '../schemas/post.schema';

const prisma = new PrismaClient();

export class PostController {
  // GET /posts - Listar todos os posts
  static async getAllPosts(req: Request<{}, {}, {}, GetAllPostsInput['query']>, res: Response) {
    try {
      const { page = 1, limit = 10, include, published } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const whereClause: any = {};
      if (published !== undefined) {
        whereClause.published = published;
      }

      const includeClause = include ? {
        author: true,
        comments: true
      } : undefined;

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where: whereClause,
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
          include: includeClause
        }),
        prisma.post.count({ where: whereClause })
      ]);

      res.json({
        success: true,
        data: posts,
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
        message: 'Erro ao buscar posts',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // GET /posts/:id - Buscar post por ID (com include para mostrar dados do autor)
  static async getPostById(req: Request<GetPostInput['params'], {}, {}, GetPostInput['query']>, res: Response) {
    try {
      const { id } = req.params;
      const { include } = req.query;

      const includeClause = include ? {
        author: true,
        comments: true
      } : undefined;

      const post = await prisma.post.findUnique({
        where: { id },
        include: includeClause
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado'
        });
      }

      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar post',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // POST /posts - Criar novo post
  static async createPost(req: Request<{}, {}, CreatePostInput['body']>, res: Response) {
    try {
      const { title, content, published, authorId } = req.body;

      // Verificar se o autor existe
      const author = await prisma.user.findUnique({
        where: { id: authorId }
      });

      if (!author) {
        return res.status(404).json({
          success: false,
          message: 'Autor não encontrado'
        });
      }

      const post = await prisma.post.create({
        data: {
          title,
          content,
          published,
          authorId
        }
      });

      res.status(201).json({
        success: true,
        data: post,
        message: 'Post criado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao criar post',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // PUT /posts/:id - Atualizar post
  static async updatePost(req: Request<UpdatePostInput['params'], {}, UpdatePostInput['body']>, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Se está tentando alterar o autor, verificar se existe
      if (updateData.authorId) {
        const author = await prisma.user.findUnique({
          where: { id: updateData.authorId }
        });

        if (!author) {
          return res.status(404).json({
            success: false,
            message: 'Autor não encontrado'
          });
        }
      }

      const post = await prisma.post.update({
        where: { id },
        data: updateData
      });

      res.json({
        success: true,
        data: post,
        message: 'Post atualizado com sucesso'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Record to update not found')) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar post',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // DELETE /posts/:id - Deletar post
  static async deletePost(req: Request<DeletePostInput['params']>, res: Response) {
    try {
      const { id } = req.params;

      await prisma.post.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Post deletado com sucesso'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
        return res.status(404).json({
          success: false,
          message: 'Post não encontrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao deletar post',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}
