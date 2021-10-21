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
CMD [ "npm", "run", "start:debug" ]

FROM base AS prod
ENV NODE_ENV=production
RUN npm ci --production
COPY . .
RUN npm run build
CMD [ "npm", "run", "start:prod" ]
