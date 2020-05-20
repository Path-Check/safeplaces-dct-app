#!/bin/bash
set -e # exit immediately on errors

sudo apt-get install jq moreutils

# writes a timestamp to the end of the current package.json version
# e.g. 1.0.65 -> 1.0.65.1589941056.235517
cat package.json | grep version

SHA=$(git rev-parse --short HEAD)

jq --arg SHA "$SHA" '.version=(.version) + "-" + $SHA' package.json | sponge package.json

cat package.json | grep version
