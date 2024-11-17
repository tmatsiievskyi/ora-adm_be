FROM node:22-alpine3.19

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

CMD ["pnpm", "run", "start:dev"]