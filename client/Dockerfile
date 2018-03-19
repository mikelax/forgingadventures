FROM node:8.9.1-alpine

# for dev only - extend watchers limit for CRA file watchers and auto-reload
COPY ./etc/sysctl.conf /etc/sysctl.conf

# define paths
WORKDIR /app
ADD . /app

EXPOSE 3000

CMD yarn && yarn start
