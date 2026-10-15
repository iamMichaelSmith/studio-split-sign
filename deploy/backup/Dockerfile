ARG APP_IMAGE
FROM ${APP_IMAGE} AS app
FROM postgres:18-bookworm
COPY --from=app /usr/local/bin/node /usr/local/bin/node
COPY --from=app /app/node_modules /app/node_modules
COPY --from=app /opt/aws-rds/global-bundle.pem /opt/aws-rds/global-bundle.pem
WORKDIR /app
COPY backup.cjs /app/backup.cjs
ENTRYPOINT ["node", "/app/backup.cjs"]
