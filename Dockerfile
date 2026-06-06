FROM node:20-slim AS base
WORKDIR /app

# Stage 1: Install production dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Build the application
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Runner
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy only what is needed for production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# Public folder assets are already in dist/client after build, 
# but we copy it just in case the server expects it at root.
COPY --from=build /app/public ./public
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/server/server.js"]
