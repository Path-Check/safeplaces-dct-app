# Private Kit

<img src="./assets/ShieldKeyHold512x512.png" data-canonical-src="./assets/ShieldKeyHold512x512.png" width="200" height="200" />

A personal location vault that nobody else can access. Log your location privately every five minutes. No information will leave the phone.

**Downloads:** [Google Play](https://play.google.com/store/apps/details?id=edu.mit.privatekit) | Apple App Store - coming soon!

**Home page:** http://privatekit.mit.edu


## Behavior

1. Get consent to locally track location and send an encoded version online.
2. Locally cache loction info once every 5 minutes: ```	Time  |  GPS Lat  |  GPS Lon ```

# Development Overview

This is a React Native app version 61.5

## Architecture

Please refer to `docs/Private Kit Diagram.png` for a basic overview on the sequencing of generalized events and services that are utilized by Private Kit.

## Developer Setup

Refer to and run the dev_setup.sh for needed tools.

### iOS Configuration - First Time Setup

1. Move to `ios` directory and run `pod install`
2. If you have any trouble with packages not round, try `react-native link` from project directory.
3. Look at running commands below.

## Running

Install modules:
```npm install``` or ```yarn install``` (note ```yarn``` does a better job at installing dependencies on macOS)

To run, do:
```
npx react-native run-android
```
or
```
npx react-native run-ios --simulator="iPhone 8 Plus"
```

NOTE: In some cases, the abovementioned procedure leads to the error 'Failed to load bundle - Could not connect to development server'. In these cases, kill all other react-native processes and try it again.

## Contributing

Read the [contribution guidelines](CONTRIBUTING.md).

WhatsApp: https://chat.whatsapp.com/HXonYGVeAwQIKxO0HYlxYL
Slack: https://safepathsprivatekit.slack.com/


