# The build container
FROM node:8.9.4-alpine as builder

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
COPY /config /usr/src/app/config
COPY /public /usr/src/app/public
COPY /scripts /usr/src/app/scripts
COPY /src /usr/src/app/src

RUN mkdir /usr/src/app/build

ENV NODE_ENV production

WORKDIR /usr/src/app

RUN yarn install --frozen-lockfile --no-cache --production
RUN yarn build

# The deployed container
FROM nginx:1.13-alpine

COPY ./etc/nginx.conf /etc/nginx/

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build .

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
