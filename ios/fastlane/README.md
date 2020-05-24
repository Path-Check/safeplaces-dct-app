fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew cask install fastlane`

# Available Actions
## iOS
### ios sync_local_certs
```
fastlane ios sync_local_certs
```

### ios staging
```
fastlane ios staging
```
Push a new GPS Staging build for automation
### ios staging_bte
```
fastlane ios staging_bte
```
Push a new BTE Staging build for automation
### ios release
```
fastlane ios release
```
Push a new GPS Release build to TestFlight
### ios release_bte
```
fastlane ios release_bte
```
Push a new BTE Release build to TestFlight
### ios deploy
```
fastlane ios deploy
```
Push a new beta build to TestFlight

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
