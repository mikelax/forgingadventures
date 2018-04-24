FROM node:8.9.1-alpine

WORKDIR /tmp/packages
COPY ./package.json ./yarn.lock ./
RUN yarn install

# Create app directory
WORKDIR /app
RUN cp -R /tmp/packages/node_modules .
COPY . /app

EXPOSE 3001

CMD yarn start
