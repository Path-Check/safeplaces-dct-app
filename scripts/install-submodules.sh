#!/bin/bash

# Workaround for known yarn issue: https://github.com/yarnpkg/yarn/issues/1488

DIR="$1"
GITMODULES="$DIR/.gitmodules"

if test -f "$GITMODULES"; then
  echo "Installing submodules in $GITMODULES"
  git config -f "$GITMODULES" -l | sed 's/.*=//' | xargs -n2 sh -c '[ -z "$(ls -A '"$DIR"'/$0)" ] && git clone --quiet $1 '"$DIR"'/$0'
fi

exit 0
