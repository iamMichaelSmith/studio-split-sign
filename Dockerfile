# syntax=docker/dockerfile:1.7
FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5050
ENV HOST=0.0.0.0

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

RUN --mount=type=secret,id=npm_ca,required=false \
  if [ -f /run/secrets/npm_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/npm_ca; fi; \
  npm install -g npm@latest --no-audit --fund=false

COPY package*.json ./

ARG INSTALL_OPTIONAL_DEPS=false
RUN --mount=type=secret,id=npm_ca,required=false \
  if [ -f /run/secrets/npm_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/npm_ca; fi; \
  if [ "$INSTALL_OPTIONAL_DEPS" = "true" ]; then \
    npm ci --omit=dev --no-audit --fund=false; \
  else \
    npm ci --omit=dev --omit=optional --no-audit --fund=false; \
  fi \
  && npm cache clean --force

ADD https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem /opt/aws-rds/global-bundle.pem

ENV PG_SSL_CA_PATH=/opt/aws-rds/global-bundle.pem

COPY . .

RUN chmod 0644 /opt/aws-rds/global-bundle.pem \
  && mkdir -p /app/data/submissions /app/data/pdfs \
  && chown -R node:node /app

USER node

EXPOSE 5050

CMD ["node", "server.js"]
