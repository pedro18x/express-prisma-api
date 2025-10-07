export const config = {
  database: {
    url: process.env.DATABASE_URL || "postgresql://username:password@localhost:5432/express_prisma_api?schema=public"
  },
  server: {
    port: parseInt(process.env.PORT || "3000"),
    env: process.env.NODE_ENV || "development"
  }
};
