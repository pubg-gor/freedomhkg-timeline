#!/bin/bash

# FIXME:
exit 0;

# call the healthz API for 6 times in 10s interval to ensure the service is up and running
for i in 1 2 3 4 5 6; do curl -f localhost:3000/healthz && exit 0 || sleep 10; done
exit 1;
