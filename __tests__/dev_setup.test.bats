#!/usr/bin/env bats

@test "homebrew is installed" {
  mac_only

  run found_exe brew
  [ "$status" -eq 0 ]
}

@test "watchman is installed" {
  mac_only

  run found_exe watchman
  [ "$status" -eq 0 ]
}

@test "yarn is installed" {
  run found_exe yarn
  [ "$status" -eq 0 ]
}

@test "react-native is installed" {
  run found_exe react-native
  [ "$status" -eq 0 ]
}

@test "node is installed" {
  run found_exe node
  [ "$status" -eq 0 ]
}

@test "java is installed" {
  run found_exe java
  [ "$status" -eq 0 ]
}

@test "android-studio is installed" {
  linux_only

  run found_exe android-studio
  [ "$status" -eq 0 ]
}

@test "~/.profile_mobileapp exists" {
  run test -f $HOME/.profile_mobileapp
  [ "$status" -eq 0 ]
}

@test "ios/vendor/bundle exists" {
  mac_only

  run test -d ios/vendor/bundle
  [ "$status" -eq 0 ]
}

@test "ANDROID_SDK_ROOT is set (Mac)" {
  mac_only

  source ~/.profile_mobileapp

  run echo "$ANDROID_SDK_ROOT"
  [ "$output" == "$HOME/Library/Android/sdk" ]
}

@test "ANDROID_SDK_ROOT is set (Linux)" {
  linux_only

  source ~/.profile_mobileapp

  run echo "$ANDROID_SDK_ROOT"
  [ "$output" == "$HOME/Android/Sdk" ]
}


function found_exe() {
  hash "$1" 2>/dev/null
}

function linux_only() {
  if [ "$OSTYPE" != "linux"* ]; then
    skip "Linux only test"
  fi
}

function mac_only() {
  if [ "$OSTYPE" != "darwin"* ]; then
    skip "Mac only test"
  fi
}
