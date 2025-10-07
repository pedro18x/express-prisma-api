import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { validate } from '../middleware/validation';
import { 
  createCommentSchema, 
  updateCommentSchema, 
  getCommentSchema, 
  deleteCommentSchema,
  getAllCommentsSchema
} from '../schemas/comment.schema';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comentários
 *   description: Gerenciamento de comentários
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Listar todos os comentários
 *     tags: [Comentários]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de itens por página
 *       - in: query
 *         name: postId
 *         schema:
 *           type: integer
 *         description: Filtrar comentários por post
 *     responses:
 *       200:
 *         description: Lista de comentários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Comment'
 *                       - type: object
 *                         properties:
 *                           post:
 *                             $ref: '#/components/schemas/Post'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', validate(getAllCommentsSchema), CommentController.getAllComments);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Buscar comentário por ID
 *     tags: [Comentários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do comentário
 *     responses:
 *       200:
 *         description: Comentário encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Comment'
 *                     - type: object
 *                       properties:
 *                         post:
 *                           $ref: '#/components/schemas/Post'
 *       404:
 *         description: Comentário não encontrado
 */
router.get('/:id', validate(getCommentSchema), CommentController.getCommentById);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Criar novo comentário
 *     tags: [Comentários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - postId
 *             properties:
 *               content:
 *                 type: string
 *                 description: Conteúdo do comentário
 *               postId:
 *                 type: integer
 *                 description: ID do post
 *     responses:
 *       201:
 *         description: Comentário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *                 message:
 *                   type: string
 *       404:
 *         description: Post não encontrado
 */
router.post('/', validate(createCommentSchema), CommentController.createComment);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Atualizar comentário
 *     tags: [Comentários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do comentário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Conteúdo do comentário
 *     responses:
 *       200:
 *         description: Comentário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *                 message:
 *                   type: string
 *       404:
 *         description: Comentário não encontrado
 */
router.put('/:id', validate(updateCommentSchema), CommentController.updateComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Deletar comentário
 *     tags: [Comentários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do comentário
 *     responses:
 *       200:
 *         description: Comentário deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Comentário não encontrado
 */
router.delete('/:id', validate(deleteCommentSchema), CommentController.deleteComment);

export default router;
