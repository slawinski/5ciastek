FROM node:20 AS build
WORKDIR /app

# Install all dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Runner stage
FROM node:20 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy built assets and ALL node_modules to ensure nothing is missing
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000

# Using npm run start for more robust initialization
CMD ["npm", "run", "start"]
