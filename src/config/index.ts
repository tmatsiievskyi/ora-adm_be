export const config = {
  server: {
    port: Number(process.env.PORT || '4000'),
    nodeEnv: process.env.NODE_ENV as string,
  },
};
