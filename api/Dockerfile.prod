FROM node:24-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

# Installer les dépendances
RUN npm ci

# Copier le reste du code
COPY . .

# Build arguments pour les variables d'environnement
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Générer Prisma Client
RUN npm run db:generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts


ENV NODE_ENV=production

CMD ["npm", "start"]