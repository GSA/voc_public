#!/usr/bin/env bash
./wait-for-it.sh -t 5 admin:80 -- bundle exec rails s --port 8080 --binding '0.0.0.0'
