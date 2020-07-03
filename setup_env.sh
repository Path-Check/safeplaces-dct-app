#!/bin/bash                                                                                                         

HA=$1

git submodule update --remote --merge

if [[ $# -eq 0 ]] ; then
  tput setaf 1; echo 'You must supply a config argument'
  exit 1
fi

if [ "$HA" = github ]; then
  exit 0
fi

if [ ! -f pathcheck-mobile-resources/environment/$HA/.env.bt ]; then
  tput setaf 1; echo 'pathcheck-mobile-resources/environment/'$HA'/.env.bt does not exist'
  exit 1
fi

if [ ! -f pathcheck-mobile-resources/environment/$HA/.env.bt.release ]; then
  tput setaf 1; echo 'pathcheck-mobile-resources/environment/'$HA'/.env.bt.release does not exist'
  exit 1
fi

cp -r pathcheck-mobile-resources/environment/$HA/. ./

git update-index --assume-unchanged .env.bt
git update-index --assume-unchanged .env.bt.release
