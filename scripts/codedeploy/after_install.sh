#!/usr/bin/env bash
set -e

DEPLOYDIR="freedomhkg-timeline"
CONFIG_PATH="/home/ec2-user/$DEPLOYDIR/src/server/config"

# keep telegram data
mv "/home/ec2-user/old-$DEPLOYDIR/tg-export/*" "/home/ec2-user/$DEPLOYDIR/tg-export" | true

# keep tg images in /static
mv "/home/ec2-user/old-$DEPLOYDIR/static/telegram-images/*" "/home/ec2-user/$DEPLOYDIR/static/telegram-images" | true

# clean up
rm -rf "/home/ec2-user/old-$DEPLOYDIR"

cd "/home/ec2-user/$DEPLOYDIR"

# git clone telegram export library
git clone https://github.com/expectocode/telegram-export.git telegram-export
cd "/home/ec2-user/$DEPLOYDIR/telegram-export"
python3 setup.py install

aws s3 cp s3://freedomhkg-timeline/credential-production.env "$CONFIG_PATH"


