import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateUserInput, UpdateUserInput, GetUserInput, DeleteUserInput } from '../schemas/user.schema';

const prisma = new PrismaClient();

export class UserController {
  // GET /users - Listar todos os usuários
  static async getAllUsers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count()
      ]);

      res.json({
        success: true,
        data: users,
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
        message: 'Erro ao buscar usuários',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // GET /users/:id - Buscar usuário por ID
  static async getUserById(req: Request<GetUserInput['params']>, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: {
          posts: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar usuário',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // POST /users - Criar novo usuário
  static async createUser(req: Request<{}, {}, CreateUserInput['body']>, res: Response) {
    try {
      const { email, name } = req.body;

      const user = await prisma.user.create({
        data: {
          email,
          name
        }
      });

      res.status(201).json({
        success: true,
        data: user,
        message: 'Usuário criado com sucesso'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return res.status(409).json({
          success: false,
          message: 'Email já está em uso'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao criar usuário',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // PUT /users/:id - Atualizar usuário
  static async updateUser(req: Request<UpdateUserInput['params'], {}, UpdateUserInput['body']>, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: updateData
      });

      res.json({
        success: true,
        data: user,
        message: 'Usuário atualizado com sucesso'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Record to update not found')) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return res.status(409).json({
          success: false,
          message: 'Email já está em uso'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar usuário',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  // DELETE /users/:id - Deletar usuário
  static async deleteUser(req: Request<DeleteUserInput['params']>, res: Response) {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: { id: Number(id) }
      });

      res.json({
        success: true,
        message: 'Usuário deletado com sucesso'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao deletar usuário',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}
