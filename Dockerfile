FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5050
ENV HOST=0.0.0.0

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

RUN mkdir -p /app/data/submissions /app/data/pdfs \
  && chown -R node:node /app

USER node

EXPOSE 5050

CMD ["npm", "start"]
