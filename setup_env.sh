#!/bin/bash                                                                                                         

DOWNLOAD_PATH=$1

git submodule update --remote --merge

if [[ $# -eq 0 ]] ; then
    tput setaf 1; echo 'You must supply a config argument'
    exit 1
fi

if [ ! -f pathcheck-mobile-resources/environment/$DOWNLOAD_PATH/.env.bt ]; then
    tput setaf 1; echo 'pathcheck-mobile-resources/environment/'$DOWNLOAD_PATH'/.env.bt does not exist'
    exit 1
fi

if [ ! -f pathcheck-mobile-resources/environment/$DOWNLOAD_PATH/.env.bt.staging ]; then
    tput setaf 1; echo 'pathcheck-mobile-resources/environment/'$DOWNLOAD_PATH'/.env.bt.staging does not exist'
    exit 1
fi

if [ ! -f pathcheck-mobile-resources/environment/$DOWNLOAD_PATH/.env.bt.release ]; then
    tput setaf 1; echo 'pathcheck-mobile-resources/environment/'$DOWNLOAD_PATH'/.env.bt.release does not exist'
    exit 1
fi

cp -r pathcheck-mobile-resources/environment/$DOWNLOAD_PATH/. ./

git update-index --assume-unchanged .env.bt
git update-index --assume-unchanged .env.bt.staging
git update-index --assume-unchanged .env.bt.release