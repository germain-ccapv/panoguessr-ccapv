FROM node:22

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

EXPOSE 3000

RUN pnpm run build

CMD ["node", "/app/.output/server/index.mjs"]
