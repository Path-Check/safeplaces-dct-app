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
Push a new staging build for automation
### ios beta
```
fastlane ios beta
```
Push a new Beta build (AdHoc Signed Release build)
### ios release
```
fastlane ios release
```
Push a new Release build to TestFlight
### ios deploy
```
fastlane ios deploy
```
Push a new beta build to TestFlight

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
