#!/bin/sh

if [ -z "$PASSENGER_APP_ENV" -o -z "$APP_NAME" ]; then
    echo "APP_NAME or PASSENGER_APP_ENV variable is not set. Skipping secrets."
    exit
fi

mkdir -p /etc/container_environment

# set secrets from AWS SSM parameter store
node /home/app/setEnvironmentSecrets.js
