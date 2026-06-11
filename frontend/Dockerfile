FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_NODE_ADDRESS
ARG VITE_BACKEND_ADDRESS

ENV VITE_NODE_ADDRESS=${VITE_NODE_ADDRESS} \
    VITE_BACKEND_ADDRESS=${VITE_BACKEND_ADDRESS}

COPY frontend/package.json frontend/yarn.lock frontend/.yarnrc.yml ./
COPY frontend/.yarn/releases .yarn/releases
RUN yarn install --frozen-lockfile

COPY frontend/ .
RUN yarn build

FROM node:20-alpine AS run

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g serve@14

COPY --from=build --chown=node:node /app/dist ./dist

USER node

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
