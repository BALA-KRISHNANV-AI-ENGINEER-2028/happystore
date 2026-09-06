# Development stage
FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# Generate Prisma client
RUN npx prisma generate

CMD [ "npm", "run", "start:dev" ]

# Build stage
FROM development AS build
RUN npm run build
# Prepare production dependencies
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY package*.json ./

# `npm ci --only=production` in the build stage deletes and reinstalls
# node_modules from scratch, which wipes the already-generated Prisma Client
# output (node_modules/.prisma) produced by `prisma generate` in the
# development stage. Restore it explicitly instead of relying on
# @prisma/client's own postinstall to silently regenerate it a second time.
COPY --from=development /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Run as a non-root user — the node:alpine base image ships a "node" user
# (uid 1000) for exactly this purpose. Limits blast radius if the app is
# ever compromised (no root inside the container).
RUN chown -R node:node /usr/src/app
USER node

EXPOSE 4000
CMD [ "npm", "run", "start:prod" ]
