#!/bin/bash
set -e # exit immediately on errors

function found_exe() {
  hash "$1" 2>/dev/null
}

if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "Checking for homebrew..."
  found_exe brew
  brew --version
fi

echo "Checking for node..."
found_exe node

node --version

echo "Checking for java..."
found_exe java

java -version

found_exe android-studio

echo "Checking for environment variables..."
if [[ -f ~/.profile_mobileapp ]]; then
  source ~/.profile_mobileapp

  echo "ANDROID_SDK_ROOT=$ANDROID_SDK_ROOT"
  echo "PATH=$PATH"
  if [[ "$PATH" != "platform-tools"* ]]; then
    echo "Android SDK is not in PATH"
    exit 1
  fi
else
  echo "Missing file ~/.profile_mobileapp"
  exit 1
fi
