@echo off
where /q yarn || ECHO Unable to find 'yarn' && EXIT /B
@echo on
cmd /c yarn install
react-native start
