FROM node:19-bullseye-slim as base
ENV NODE_ENV=production
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
EXPOSE 3000
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node package*.json yarn*.lock ./
RUN yarn install --production --ignore-scripts --prefer-offline

FROM base as dev
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH
RUN yarn install

FROM base as source
COPY --chown=node:node . .

FROM source as builder
ENV NODE_ENV=production
COPY --from=dev /app/node_modules /app/node_modules
RUN yarn build

FROM node:19-alpine as prod
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
EXPOSE 5000