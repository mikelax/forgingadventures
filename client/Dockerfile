# The build container
FROM node:8.9.4-alpine as builder

# install node packages first as we don't want to invalidate this layer during src code changes
# but onlt when package.json changes
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
WORKDIR /usr/src/app
RUN yarn install --frozen-lockfile --no-cache

# copy application artifacts
COPY /config /usr/src/app/config
COPY /public /usr/src/app/public
COPY /scripts /usr/src/app/scripts
COPY /src /usr/src/app/src
COPY .env.* /usr/src/app/
COPY .eslint* /usr/src/app/

RUN mkdir /usr/src/app/build

# Set env variables before build - these are picked up from ./.env.production
# but can be overriden during docker build via --build-env X=Y
ARG REACT_APP_AUTH0_DOMAIN
ARG REACT_APP_AUTH0_CLIENT_ID
ARG REACT_APP_AUTH0_AUDIENCE
ARG REACT_APP_AUTH0_REDIRECT_URI
ARG REACT_APP_WEBSOCKET_URI
ARG REACT_APP_CLOUDINARY_CLOUDNAME

ENV REACT_APP_AUTH0_DOMAIN=$REACT_APP_AUTH0_DOMAIN
ENV REACT_APP_AUTH0_CLIENT_ID=$REACT_APP_AUTH0_CLIENT_ID
ENV REACT_APP_AUTH0_AUDIENCE=$REACT_APP_AUTH0_AUDIENCE
ENV REACT_APP_AUTH0_REDIRECT_URI=$REACT_APP_AUTH0_REDIRECT_URI
ENV REACT_APP_WEBSOCKET_URI=$REACT_APP_WEBSOCKET_URI
ENV REACT_APP_CLOUDINARY_CLOUDNAME=$REACT_APP_CLOUDINARY_CLOUDNAME

# build using specified env for optimized build - defaults to production if not specified
ARG BUILD_TARGET

ENV NODE_ENV production
RUN if [ -z ${BUILD_TARGET} ]; then yarn build; else yarn "build:${BUILD_TARGET}"; fi

# The deployed container
FROM nginx:1.13-alpine

COPY ./etc/nginx.conf /etc/nginx/

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build .

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
