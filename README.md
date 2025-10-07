# API Express Prisma

Uma API REST completa desenvolvida com ExpressJS, TypeScript, Prisma, PostgreSQL e Zod.

## 🚀 Tecnologias Utilizadas

- **ExpressJS** - Framework web para Node.js
- **TypeScript** - Linguagem de programação com tipagem estática
- **Prisma** - ORM moderno para bancos de dados
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Biblioteca de validação de esquemas
- **Swagger** - Documentação da API

## 📋 Funcionalidades

### Recursos da API

1. **Usuários (Users)**
   - GET `/users` - Listar todos os usuários
   - GET `/users/:id` - Buscar usuário por ID (inclui posts)
   - POST `/users` - Criar novo usuário
   - PUT `/users/:id` - Atualizar usuário
   - DELETE `/users/:id` - Deletar usuário

2. **Posts**
   - GET `/posts` - Listar todos os posts
   - GET `/posts/:id` - Buscar post por ID (inclui autor e comentários)
   - POST `/posts` - Criar novo post
   - PUT `/posts/:id` - Atualizar post
   - DELETE `/posts/:id` - Deletar post

3. **Comentários**
   - GET `/comments` - Listar todos os comentários
   - GET `/comments/:id` - Buscar comentário por ID
   - POST `/comments` - Criar novo comentário
   - PUT `/comments/:id` - Atualizar comentário
   - DELETE `/comments/:id` - Deletar comentário

### Relacionamentos

- **User ↔ Post**: Um usuário pode ter vários posts (relação 1:N)
- **Post ↔ Comment**: Um post pode ter vários comentários (relação 1:N)

### Validações com Zod

Todos os endpoints possuem validação de dados com Zod:
- Validação de tipos de dados
- Validação de campos obrigatórios
- Validação de formatos (email, etc.)
- Mensagens de erro em português

### Documentação Swagger

Documentação completa da API disponível em `/api-docs` com:
- Descrição de todos os endpoints
- Esquemas de dados
- Exemplos de requisições e respostas
- Interface em português

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL
- npm ou yarn

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd express-prisma-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o PostgreSQL

1. **Instale o PostgreSQL** (se ainda não tiver):
   - Windows: Baixe do site oficial
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql postgresql-contrib`

2. **Crie o banco de dados:**
   ```bash
   psql -U postgres
   CREATE DATABASE express_prisma_api;
   \q
   ```

3. **Crie um arquivo `.env` na raiz do projeto:**
   ```env
   # Database
   DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/express_prisma_api?schema=public"
   
   # Server
   PORT=3000
   NODE_ENV=development
   ```

   Substitua `SUA_SENHA` pela senha do seu usuário PostgreSQL.

### 4. Execute as migrações do Prisma

```bash
npm run prisma:migrate
```

### 5. Gere o cliente Prisma

```bash
npm run prisma:generate
```

### 6. Popule o banco com dados de exemplo

```bash
npm run db:seed
```

### 7. Execute o projeto

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📚 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Executa o servidor em modo de desenvolvimento

# Build e Produção
npm run build           # Compila o TypeScript
npm start              # Executa o servidor compilado

# Prisma
npm run prisma:generate # Gera o cliente Prisma
npm run prisma:migrate  # Executa as migrações
npm run prisma:studio   # Abre o Prisma Studio

# Seed
npm run db:seed        # Popula o banco com dados de exemplo
```

## 🌐 Endpoints da API

### Base URL
```
http://localhost:3000
```

### Documentação
```
http://localhost:3000/api-docs
```


## 🗄️ Estrutura do Banco de Dados

### Tabelas

1. **users**
   - id (PK)
   - email (UNIQUE)
   - name
   - createdAt
   - updatedAt

2. **posts**
   - id (PK)
   - title
   - content
   - published
   - authorId (FK → users.id)
   - createdAt
   - updatedAt

3. **comments**
   - id (PK)
   - content
   - postId (FK → posts.id)
   - createdAt
   - updatedAt

## 📁 Estrutura do Projeto

```
src/
├── config/
│   └── database.ts          # Configurações do banco
├── controllers/
│   ├── user.controller.ts   # Controller de usuários
│   ├── post.controller.ts   # Controller de posts
│   └── comment.controller.ts # Controller de comentários
├── middleware/
│   └── validation.ts        # Middleware de validação
├── routes/
│   ├── user.routes.ts       # Rotas de usuários
│   ├── post.routes.ts       # Rotas de posts
│   └── comment.routes.ts    # Rotas de comentários
├── schemas/
│   ├── user.schema.ts       # Schemas de validação de usuários
│   ├── post.schema.ts       # Schemas de validação de posts
│   └── comment.schema.ts    # Schemas de validação de comentários
├── server.ts                # Arquivo principal do servidor
└── seed.ts                  # Script de seed do banco
```

## 🧪 Testando a API

1. Acesse a documentação Swagger em `http://localhost:3000/api-docs`
2. Use os dados de exemplo criados pelo seed
3. Teste todos os endpoints através da interface Swagger
4. Verifique as validações enviando dados inválidos

## 📝 Notas Importantes

- Todos os endpoints retornam respostas em formato JSON
- As mensagens de erro estão em português
- A paginação está implementada nos endpoints de listagem
- As validações impedem a criação de dados inválidos
- O relacionamento entre tabelas está configurado com cascade delete
- A documentação Swagger está completamente em português
