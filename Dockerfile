FROM node:23.9.0-alpine AS development
USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
RUN yarn install
COPY --chown=node:node . .
CMD [ "tail", "-f", "/dev/null" ]

FROM node:23.9.0-alpine AS builder
USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node --from=development /home/node/app ./
RUN yarn build
ENV NODE_ENV=production
RUN yarn install  --production=true

FROM node:23.9.0-alpine AS production
USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node --from=builder /home/node/app/dist ./dist
COPY --chown=node:node --from=builder /home/node/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /home/node/app/package.json ./
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "yarn", "start:prod" ]