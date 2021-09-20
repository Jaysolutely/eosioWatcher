#!/bin/bash

node src/server.js &
PID=$!
parcel && kill $PID