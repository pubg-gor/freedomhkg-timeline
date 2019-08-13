#!/bin/bash

DEPLOYDIR="freedomhkg-timeline"
PM2NAME="freedomhkg-timeline"

if [ -d /home/ec2-user/$DEPLOYDIR ]; then
  pm2 stop $PM2NAME | true
fi

sudo mv "/home/ec2-user/$DEPLOYDIR" "/home/ec2-user/old-$DEPLOYDIR"

sudo mkdir -vp /home/ec2-user/$DEPLOYDIR
