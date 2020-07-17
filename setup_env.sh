#!/bin/bash

# USAGE
# First argument is the name of the health authority to build
# Flags:
# --renaming: Puts the display name provided on the .env.bt files on the android
# app for ios and android bt builds
# THIS REQUIRES THE xmllint and the PlistBuddy utilities to be present

HA=$1

git submodule add -f git@github.com:Path-Check/pathcheck-mobile-resources.git
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

# In order to read properly spaces on environment variables
IFS='
'

if [ "$2" = "--renaming" ]; then

# Loading the .env.bt.release
export $(egrep -v '^#' .env.bt.release | xargs -0)

# Check for a display name on the environment variables
if [ -z "$DISPLAY_NAME" ]; then echo ERROR: No display name provided; exit 0; fi

PLIST_PATH="./ios/BT/Info.plist"
echo "read BT Info.plist file" $PLIST_PATH

IOS_CURRENT_NAME=`/usr/libexec/PlistBuddy -c "Print :CFBundleDisplayName" "$PLIST_PATH"`
echo "Changing ios display name from $IOS_CURRENT_NAME to" $DISPLAY_NAME
`/usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName $DISPLAY_NAME" "$PLIST_PATH"`

ANDROID_STRINGS_PATH="./android/app/src/bt/res/values/strings.xml"

ANDROID_CURRENT_NAME=`xmllint --xpath "/resources/string[@name='app_name']/text()" $ANDROID_STRINGS_PATH`
echo "Changing android display name from $ANDROID_CURRENT_NAME to" $DISPLAY_NAME

xmllint --shell $ANDROID_STRINGS_PATH << EOF
cd /resources/string[@name='app_name']
set $DISPLAY_NAME
save
EOF

fi
