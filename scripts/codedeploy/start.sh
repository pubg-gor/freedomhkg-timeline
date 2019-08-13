#!/usr/bin/env bash

DEPLOYDIR="freedomhkg-timeline"
PM2NAME="freedomhkg-timeline"

if [ ! -z "$DEPLOYMENT_GROUP_NAME" ]; then
 export PM2_ENV=$DEPLOYMENT_GROUP_NAME
fi

cd /home/ec2-user
pm2 start /home/ec2-user/$DEPLOYDIR/pm2.config.js --env $PM2_ENV --cwd /home/ec2-user/$DEPLOYDIR