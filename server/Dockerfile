# syntax=docker/dockerfile:1
FROM node:20-alpine

# dumb-init gives us correct signal handling (graceful shutdown) as PID 1.
RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
WORKDIR /app

# Install dependencies first to leverage layer caching.
COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm cache clean --force

# App source
COPY . .

# Run as the built-in non-root user.
RUN chown -R node:node /app
USER node

EXPOSE 5000

# Lightweight container healthcheck against the /health endpoint.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"]
