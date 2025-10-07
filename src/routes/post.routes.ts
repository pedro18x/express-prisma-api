import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { validate } from '../middleware/validation';
import { 
  createPostSchema, 
  updatePostSchema, 
  getPostSchema, 
  deletePostSchema,
  getAllPostsSchema
} from '../schemas/post.schema';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Gerenciamento de posts
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Listar todos os posts
 *     tags: [Posts]
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
 *         name: include
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Incluir dados do autor e comentários
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Filtrar por posts publicados
 *     responses:
 *       200:
 *         description: Lista de posts retornada com sucesso
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
 *                     $ref: '#/components/schemas/Post'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', validate(getAllPostsSchema), PostController.getAllPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Buscar post por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do post
 *       - in: query
 *         name: include
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Incluir dados do autor e comentários
 *     responses:
 *       200:
 *         description: Post encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Post'
 *                     - type: object
 *                       properties:
 *                         author:
 *                           $ref: '#/components/schemas/User'
 *                         comments:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Post não encontrado
 */
router.get('/:id', validate(getPostSchema), PostController.getPostById);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Criar novo post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - authorId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título do post
 *               content:
 *                 type: string
 *                 description: Conteúdo do post
 *               published:
 *                 type: boolean
 *                 default: false
 *                 description: Status de publicação
 *               authorId:
 *                 type: integer
 *                 description: ID do autor
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *                 message:
 *                   type: string
 *       404:
 *         description: Autor não encontrado
 */
router.post('/', validate(createPostSchema), PostController.createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Atualizar post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título do post
 *               content:
 *                 type: string
 *                 description: Conteúdo do post
 *               published:
 *                 type: boolean
 *                 description: Status de publicação
 *               authorId:
 *                 type: integer
 *                 description: ID do autor
 *     responses:
 *       200:
 *         description: Post atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *                 message:
 *                   type: string
 *       404:
 *         description: Post não encontrado
 */
router.put('/:id', validate(updatePostSchema), PostController.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Deletar post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do post
 *     responses:
 *       200:
 *         description: Post deletado com sucesso
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
 *         description: Post não encontrado
 */
router.delete('/:id', validate(deletePostSchema), PostController.deletePost);

export default router;
