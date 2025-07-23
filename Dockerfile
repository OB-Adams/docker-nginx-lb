# DEPENDENCIES STAGE
FROM node:24-slim AS dep

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# BUILD STAGE
FROM node:24-slim AS builder

WORKDIR /app

COPY --from=dep /app/node_modules ./node_modules

COPY . .

ENV NODE_ENV=production

RUN npm run build

# RUNNER STAGE
FROM node:24-slim AS runner

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=dep /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]

