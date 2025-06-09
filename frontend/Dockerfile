# Stage 1: Dependencies installation
FROM node:current-alpine AS deps
WORKDIR /app

COPY frontend/package.json frontend/yarn.lock frontend/.yarnrc.yml ./
COPY frontend/.yarn/releases .yarn/releases

RUN yarn install --frozen-lockfile

# Stage 2: Build application
FROM node:current-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .

ARG VITE_NODE_ADDRESS
ARG VITE_BACKEND_ADDRESS

ENV VITE_NODE_ADDRESS=${VITE_NODE_ADDRESS}
ENV VITE_BACKEND_ADDRESS=${VITE_BACKEND_ADDRESS}

# Build with production environment
RUN yarn build

# Stage 3: Production image
FROM node:current-alpine AS runner
WORKDIR /app

ARG VITE_NODE_ADDRESS
ARG VITE_BACKEND_ADDRESS

ENV VITE_NODE_ADDRESS=${VITE_NODE_ADDRESS}
ENV VITE_BACKEND_ADDRESS=${VITE_BACKEND_ADDRESS}

# Install only serve package for static file serving
RUN npm install -g serve

# Copy only build files from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
