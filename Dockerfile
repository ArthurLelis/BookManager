# Imagem base Node.js
FROM node:16-alpine

WORKDIR /app

RUN apk add --no-cache sqlite

COPY package*.json ./
COPY tsconfig.json ./
COPY jest.config.js ./

RUN npm install

COPY . .

RUN mkdir -p /app/data /app/logs

RUN npm run build

RUN npm run init-db

EXPOSE 3000

CMD ["node", "dist/app.js"]
