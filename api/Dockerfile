FROM node:8.11.1-alpine as builder

WORKDIR /tmp/packages
COPY ./package.json ./yarn.lock ./
RUN yarn install

# Create app directory
WORKDIR /app
RUN cp -R /tmp/packages/node_modules .
COPY . /app

# builds production artifcats
RUN yarn build
RUN cp ./package.json dist \
    && cp ./yarn.lock dist \
    && cp -R ./config dist \
    && cd dist \
    && yarn install --production


# the deployment container
FROM phusion/passenger-nodejs:0.9.32

# Set correct environment variables.
ENV HOME /root

# enable nginx + passenger
RUN rm -f /etc/service/nginx/down

# setup nginx
RUN rm /etc/nginx/sites-enabled/default
COPY ./etc/nginx/main.d/env.conf /etc/nginx/main.d/secrets.conf
COPY ./etc/nginx/sites-enabled/nginx-forging.conf /etc/nginx/sites-enabled/nginx-forging.conf

# /etc/my_init.d/31_secrets.sh calls /home/app/api/setEnvironmentSecrets.js to set secret environment on startup
COPY ./etc/my_init.d/31_secrets.sh /etc/my_init.d

# copy the application from the build stage
WORKDIR /home/app
RUN  mkdir api && chown app:app api
COPY --chown=app:app --from=builder /app/setEnvironmentSecrets.js ./api
COPY --chown=app:app --from=builder /app/dist ./api

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]
