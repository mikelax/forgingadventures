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

RUN mkdir /usr/src/app/build

# Set env variables before build
ARG REACT_APP_AUTH0_DOMAIN
ARG REACT_APP_AUTH0_CLIENT_ID
ARG REACT_APP_AUTH0_AUDIENCE
ARG REACT_APP_AUTH0_REDIRECT_URI
ENV REACT_APP_AUTH0_DOMAIN=$REACT_APP_AUTH0_DOMAIN
ENV REACT_APP_AUTH0_CLIENT_ID=$REACT_APP_AUTH0_CLIENT_ID
ENV REACT_APP_AUTH0_AUDIENCE=$REACT_APP_AUTH0_AUDIENCE
ENV REACT_APP_AUTH0_REDIRECT_URI=$REACT_APP_AUTH0_REDIRECT_URI

# build using production env for optimized build
ENV NODE_ENV production
RUN yarn build

# The deployed container
FROM nginx:1.13-alpine

COPY ./etc/nginx.conf /etc/nginx/

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build .

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
