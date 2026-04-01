# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./

# Only install production dependencies
RUN npm install --omit=dev

# 1. Copy the compiled JS
COPY --from=builder /app/dist ./dist

# Stage 2: Expose port and run command
EXPOSE 3001
CMD ["node", "dist/index.js"]