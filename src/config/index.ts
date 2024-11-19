export const config = {
  server: {
    port: Number(process.env.PORT || '4000'),
    nodeEnv: process.env.NODE_ENV as string,
  },
  db: {
    dbUrl: process.env.DB_URL as string,
    dbUser: process.env.MONGO_INITDB_ROOT_USERNAME as string,
    dbPassword: process.env.MONGO_INITDB_ROOT_PASSWORD as string,
    dbHost: process.env.MONGO_HOST as string,
    dbName: process.env.MONGO_INITDB_DATABASE as string,
  },
  tokens: {
    access: {
      secret: process.env.ACCESS_TOKEN_SECRET as string,
      expires: process.env.ACCESS_TOKEN_EXPIRES as string,
    },
    refresh: {
      secret: process.env.REFRESH_TOKEN_SECRET as string,
      expires: process.env.REFRESH_TOKEN_EXPIRES as string,
    },
  },
};
