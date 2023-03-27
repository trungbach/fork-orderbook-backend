FROM node:19.7.0 AS Builder

WORKDIR /app/code

RUN apt update -y
COPY ./yarn.lock ./package.json ./
RUN yarn install
COPY . .
RUN yarn prebuild && yarn build

FROM node:19.7.0-alpine
WORKDIR /app/code
COPY --from=Builder /app/code ./
CMD ["yarn", "start:prod"]
