# 🚀 Setup Rápido da API

## Passos para executar a API

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar PostgreSQL Local

1. **Instalar PostgreSQL:**
   - Windows: Baixe do site oficial ou use Chocolatey: `choco install postgresql`
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql postgresql-contrib`

2. **Iniciar o PostgreSQL:**
   - Windows: O serviço inicia automaticamente após instalação
   - macOS: `brew services start postgresql`
   - Linux: `sudo systemctl start postgresql`

3. **Criar banco de dados:**
   ```bash
   # Conectar ao PostgreSQL
   psql -U postgres
   
   # Criar banco de dados
   CREATE DATABASE express_prisma_api;
   
   # Criar usuário (opcional, pode usar o usuário padrão)
   CREATE USER api_user WITH PASSWORD '123456';
   GRANT ALL PRIVILEGES ON DATABASE express_prisma_api TO api_user;
   
   # Sair do psql
   \q
   ```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Para PostgreSQL local (ajuste conforme sua configuração)
DATABASE_URL="postgresql://postgres:123456@localhost:5432/express_prisma_api?schema=public"

# Ou se criou um usuário específico:
# DATABASE_URL="postgresql://api_user:123456@localhost:5432/express_prisma_api?schema=public"

PORT=3000
NODE_ENV=development
```

**Nota:** Substitua `postgres` e `123456` pelo seu usuário e senha do PostgreSQL.

### 4. Executar migrações e seed
```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações (criar tabelas)
npx prisma migrate dev --name init

# Popular banco com dados de exemplo
npm run db:seed
```

### 5. Executar a aplicação
```bash
npm run dev
```

### 6. Acessar a API
- **API**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/api-docs
- **Prisma Studio**: `npm run prisma:studio` (opcional)

## 🧪 Testando a API

### Exemplos de requisições:

#### 1. Listar usuários
```bash
curl http://localhost:3000/users
```

#### 2. Criar um usuário
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@example.com", "name": "Usuário Teste"}'
```

#### 3. Buscar posts com dados do autor (usando include)
```bash
curl "http://localhost:3000/posts?include=true"
```

#### 4. Criar um post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Meu Post", "content": "Conteúdo do post", "published": true, "authorId": 1}'
```

## 📋 Checklist de Funcionalidades

- ✅ 3 recursos (Users, Posts, Comments)
- ✅ 5 endpoints para cada recurso (GET, GET/:id, POST, PUT, DELETE)
- ✅ Relacionamentos entre tabelas (@relation)
- ✅ GET com include para mostrar dados relacionados
- ✅ Swagger completo em português
- ✅ Validações com Zod
- ✅ Integração com PostgreSQL via Prisma
- ✅ Script de seed com dados de exemplo

## 🔧 Comandos Úteis

```bash
# Ver dados no banco
npm run prisma:studio

# Reset do banco (cuidado!)
npx prisma migrate reset

# Ver logs do Prisma
npx prisma migrate dev --create-only

# Build para produção
npm run build
npm start
```

## 🆘 Solução de Problemas

### Erro de conexão com PostgreSQL
- **PostgreSQL não está rodando:**
  - Windows: Verifique os serviços (`services.msc`) ou reinicie o serviço
  - macOS: `brew services restart postgresql`
  - Linux: `sudo systemctl restart postgresql`

- **Credenciais incorretas:**
  - Verifique usuário e senha no `.env`
  - Teste a conexão: `psql -U postgres -d express_prisma_api`
  - Ou: `npx prisma db pull`

- **Banco não existe:**
  ```bash
  psql -U postgres
  CREATE DATABASE express_prisma_api;
  \q
  ```

### Erro de migração
- Delete a pasta `prisma/migrations`
- Execute: `npx prisma migrate dev --name init`

### Erro de dependências
- Delete `node_modules` e `package-lock.json`
- Execute: `npm install`

### Erro de permissões (Linux/macOS)
```bash
# Dar permissões ao usuário
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE express_prisma_api TO seu_usuario;
\q
```