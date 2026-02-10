FROM node:20-alpine AS development

# Instalar bash e cliente MySQL para suportar scripts de setup (scripts/setup.sh)
RUN apk add --no-cache bash mysql-client

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm install

# Build será feito em runtime com npm run start:dev
# Não fazemos build aqui para evitar criar dist/ com permissões de root

FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
