#!/bin/bash
set -e # exit immediately on errors

function found_bin() {
  hash "$1" 2>/dev/null
}

function require_bin() {
  if ! found_bin $1; then
    if [[ "$OSTYPE" == "darwin"* ]]; then

      if ! found_bin brew; then
        echo "You must install homebrew: https://docs.brew.sh/Installation"
        exit 1
      fi
      brew install $2

    else
      sudo apt-get install $2
    fi
  fi
}

require_bin jq jq
require_bin sponge moreutils

# writes a timestamp to the end of the current package.json version
# e.g. 1.0.65 -> 1.0.65.1589941056.235517
cat package.json | grep version

# PRs create a merge commit into develop, so we cannot use $GITHUB_SHA
# instead we need ${{ github.head_ref }} which is the pure head ref
echo "GITHUB_REF: $GITHUB_REF"
echo "GITHUB_REF: $GITHUB_REF"
echo "HEAD_REF_SHA: $HEAD_REF_SHA"
SHA=$(git rev-parse --short $GITHUB_REF)
echo "SHA: $SHA"

jq --arg SHA "$SHA" '.version=(.version) + "-" + $SHA' package.json | sponge package.json

cat package.json | grep version
