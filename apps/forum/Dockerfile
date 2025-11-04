FROM node:20-alpine AS base

WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS development
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3002
CMD ["node", "src/server.js"]

FROM base AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs . .

USER nodejs

EXPOSE 3002

CMD ["node", "src/server.js"]

