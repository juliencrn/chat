# syntax=docker/dockerfile:1
FROM node:16.9.1 AS base

WORKDIR /app

COPY package*.json ./

FROM base AS test
RUN npm ci
COPY . .
RUN npm run test

FROM base AS dev
RUN npm install
COPY . .
ENV NODE_ENV=development
CMD [ "npm", "run", "start:debug" ]

FROM base AS prod
RUN npm ci --production
RUN npm run build
COPY . .
ENV NODE_ENV=production
CMD [ "npm", "run", "start:prod" ]
