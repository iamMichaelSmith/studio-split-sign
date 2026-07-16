FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5050
ENV HOST=0.0.0.0

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm config set strict-ssl false \
  && npm install --omit=dev --no-audit --fund=false \
  && npm cache clean --force

COPY . .

RUN mkdir -p /app/data/submissions /app/data/pdfs \
  && chown -R node:node /app

USER node

EXPOSE 5050

CMD ["node", "server.js"]
