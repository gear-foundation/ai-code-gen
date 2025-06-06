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

# Build with production environment
RUN yarn build

# Stage 3: Production image
FROM node:current-alpine AS runner
WORKDIR /app

# Install only serve package for static file serving
RUN npm install -g serve

# Copy only build files from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
