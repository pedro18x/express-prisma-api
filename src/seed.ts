import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  const user1 = await prisma.user.create({
    data: {
      email: 'joao@example.com',
      name: 'João Silva'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'maria@example.com',
      name: 'Maria Santos'
    }
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'pedro@example.com',
      name: 'Pedro Oliveira'
    }
  });

  console.log('✅ Usuários criados:', { user1, user2, user3 });

  // Criar posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Introdução ao TypeScript',
      content: 'TypeScript é uma linguagem de programação desenvolvida pela Microsoft que adiciona tipagem estática ao JavaScript.',
      published: true,
      authorId: user1.id
    }
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Trabalhando com Prisma ORM',
      content: 'Prisma é um ORM moderno que facilita o trabalho com bancos de dados em aplicações Node.js.',
      published: true,
      authorId: user2.id
    }
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Validação com Zod',
      content: 'Zod é uma biblioteca de validação de esquemas TypeScript que oferece uma API simples e poderosa.',
      published: false,
      authorId: user1.id
    }
  });

  const post4 = await prisma.post.create({
    data: {
      title: 'APIs REST com Express',
      content: 'Express.js é um framework web rápido e minimalista para Node.js, ideal para criar APIs REST.',
      published: true,
      authorId: user3.id
    }
  });

  console.log('✅ Posts criados:', { post1, post2, post3, post4 });

  // Criar comentários
  const comment1 = await prisma.comment.create({
    data: {
      content: 'Excelente artigo! TypeScript realmente facilita o desenvolvimento.',
      postId: post1.id
    }
  });

  const comment2 = await prisma.comment.create({
    data: {
      content: 'Muito útil para quem está começando com TypeScript.',
      postId: post1.id
    }
  });

  const comment3 = await prisma.comment.create({
    data: {
      content: 'Prisma é realmente uma ferramenta incrível!',
      postId: post2.id
    }
  });

  const comment4 = await prisma.comment.create({
    data: {
      content: 'Zod é essencial para validação de dados em APIs.',
      postId: post3.id
    }
  });

  const comment5 = await prisma.comment.create({
    data: {
      content: 'Express é o framework mais popular para Node.js.',
      postId: post4.id
    }
  });

  const comment6 = await prisma.comment.create({
    data: {
      content: 'Ótimo para criar APIs rápidas e eficientes.',
      postId: post4.id
    }
  });

  console.log('✅ Comentários criados:', { comment1, comment2, comment3, comment4, comment5, comment6 });

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
