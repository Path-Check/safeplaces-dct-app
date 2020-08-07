<div align="center">
  <h1>COVID Safe Paths</h1>

  <a href="https://pathcheck.org/">
    <img
      width="80"
      height="67"
      alt="pathcheck logo"
      src="./assets/Safe_Paths_Logo.png"
    />
  </a>

  <b>**https://pathcheck.org/**</b>
</div>

<hr />

# Project Overview

Help us stop COVID-19.

COVID Safe Paths is a mobile app for digital contract tracing (DCT) sponsored by Path Check a nonprofit and developed by a growing global community of engineers, designers, and contributors. Safe Paths is based on research originally conducted at the MIT Media Lab.

## Privacy Preserving

What’s truly special about Safe Paths is our strong commitment to preserving the privacy of individual users. We're building an application that can help contain outbreaks of COVID-19 without forcing users to sacrifice their personal privacy. For example, if a user chooses to use Safe Paths to maintain a record of their locations use a time stamped GPS log, which stores 14 days of data in 5 minute increments. The location log is stored on the user's phone. The logged data only leaves the device if the user chooses to send the information to an authorized public health authority (PHA) as part of the contact tracing process.

## Multiple Capabilities

Safe Paths is designed to support a range of DCT and public health use cases. Currently the main build uses GPS for location tracking. Our roadmap includes adding support for other location and proximity technologies, symptom tracking, and communication with PHAs.

## Multiple Implementation Strategies

The Safe Paths app is being developed to support a variety of build 'flavors' of the application around core health and tracing functionality. Reach out to our team to discuss creating a flavor for your use-case.

### Path Check Release of COVID Safe Paths

Safe Paths is available as an app published by Path Check in the [Apple App Store](https://apps.apple.com/us/app/covid-safe-paths/id1508266966) and the [Google Play App Store](https://play.google.com/store/apps/details?id=org.pathcheck.covidsafepaths). Any authorized pubic health authority can use Safe Paths.

### Custom Builds

We welcome public health authorities and other organizations implementing digital contact tracing strategies to create custom builds for their specific needs, incorporate Safe Paths features into their applications, or create downstream projects that stay linked to the Safe Paths project. If intending to fork the repository and develop off of it, be aware that this comes "at your own risk" for continued maintenance.

## End-to-End System

Safe Paths is designed to work with Safe Places, a tool for contact tracing teams to work with location data in the course of contact tracing interviews and to publish points of concern. Without having to sharing their own location history, a Safe Paths user can download the points of concern from their PHA to identify if they have had risk of an exposure.

## Broad Non-Developer Community

One of the important aspects of the Safe Paths open source project is that it's supported by a large community of volunteers in addition to the open source developer community. Spanning as diverse domains as product management, user research, cryptography, security, compliance, design, and videography more than 1,400 Path Check volunteers are working together to support Safe Paths and help drive adoption around the world.

### Learn More

[COVID Safe Paths Website](https://covidsafepaths.org/)

[Apps Gone Rogue: Maintaining Personal Privacy in an Epidemic](https://drive.google.com/file/d/1nwOR4drE3YdkCkyy_HBd6giQPPhLEkRc/view?usp=sharing) - The original white paper.

[COVID Safe Paths Slack](covidsafepaths.slack.com) - Where the community lives.

[Path-Check/gaen-mobile](https://github.com/Path-Check/gaen-mobile) - PathCheck's GAEN based contract tracing solution.

### Downloads for COVID Safe Paths

[Google Play](https://play.google.com/store/apps/details?id=org.pathcheck.covidsafepaths) | [Apple Store](https://apps.apple.com/us/app/covid-safe-paths/id1508266966)

<br />

# Development Overview

![Android and iOS build on MacOS](https://github.com/Path-Check/covid-safe-paths/workflows/Android%20and%20iOS%20build%20on%20MacOS/badge.svg)

_Safe Paths_ is built on [React Native](https://reactnative.dev/docs/getting-started) v0.61.5

## Contributing

Read the [contribution guidelines](CONTRIBUTING.md).

If you're looking for a first ticket - please check out the backlog for a bug or first story [JIRA project.](https://pathcheck.atlassian.net/secure/RapidBoard.jspa?rapidView=9&projectKey=SAF&view=planning.nodetail&selectedIssue=SAF-264&issueLimit=100)

## Architecture

View the [architecture diagram](docs/Private_Kit_Diagram.png) for a basic overview on the sequencing of generalized events and services that are used by Safe Paths.

## Developer Setup

First, run the appropriate setup script for your system. This will install relevant packages, walk through Android Studio configuration, etc.

**Note:** You will still need to [configure an Android Virtual Device (AVD)](https://developer.android.com/studio/run/managing-avds#createavd) after running the script.

### Linux/MacOS

```Shell
dev_setup.sh
```

### Windows

```Shell
dev_setup.bat
```

### Environment

Populate the following `.env` files. View an example file at `example.env`

```Shell
.env.dev
.env.staging
.env.release
```

You can configure `AUTHORITIES_YAML_ROUTE` against `https://raw.githubusercontent.com/Path-Check/trusted-authorities/master/staging/authorities.1.0.1.yaml`.

`ZENDESK_URL` can be omitted in development, and the Report Issue page will throw an error when submitting.

## Running

**Note:** In some cases, these procedures can lead to the error `Failed to load bundle - Could not connect to development server`. In these cases, kill all other react-native processes and try it again.

### Android (Windows, Linux, macOS)

```Shell
yarn run-android ## for the location enabled app
```

Device storage can be cleared by long-pressing on the app icon in the simulator, clicking "App info", then "Storage", and lastly, "Clear Storage".

#### iOS (macOS only)

First, install the pod files:

```Shell
yarn install:pod ## only needs to be ran once
```

Then, run the application:

```Shell
yarn run-ios ## for the location enabled app
```

Device storage can be cleared by clicking "Hardware" on the system toolbar, and then "Erase all content and settings".

Privacy settings can be reset by going to Settings > General > Reset > Reset
Location & Privacy

### Release Builds

Generating a release build is an optional step in the development process.

- [Android instructions](https://reactnative.dev/docs/signed-apk-android)

### Debugging

[react-native-debugger](https://github.com/jhen0409/react-native-debugger) is recommended. This tool will provide visibility of the JSX hierarchy, breakpoint usage, monitoring of network calls, and other common debugging tasks.

## Tooling

#### TypeScript

This project is using
[typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).

Run the complier with:
```Shell
yarn tsc
```

Not every file *needs* to be written in TypeScript, but we are preferring to use
TypeScript in general.

Note that for React-Native projects, TypeScript complication is handled by the
metro-bundler build process and there is no need to emit js code into a bundle
as one would do in a web context, hence the inclusion of the `--noEmit` flag.

#### Prettier

This project is using [prettier](https://prettier.io/docs/en/install.html).

We have a local prettierrc file, please make sure your development environment
is set to use the project's prettierrc.

#### Husky

This project is using [husky](https://github.com/typicode/husky) to automate
running validation and tests locally on a pre-push git hook.

If you ever need to push code without running these scripts, you can pass the
`--no-verify` flag on `git push`.

#### ESLint

This project is using [eslint](https://eslint.org/docs/user-guide/getting-started).

We have linting checks on CI, please make sure to include the checks locally in
your IDE.

## Testing

Tests are ran automatically through Github actions - PRs are not able to be merged if there are tests that are failing.

### Static Testing

To run the static analysis tools:

```Shell
yarn validate
```

### Unit Test

To run the unit tests:

```Shell
yarn test --watch
```

[Snapshot testing](https://jestjs.io/docs/en/snapshot-testing) is used as a quick way to verify that the UI has not changed. To update the snapshots:

```Shell
yarn update-snapshots
```

### e2e Test

**Note:** Right now, there is only e2e test support for iOS.

e2e tests are written using [_detox_](https://github.com/wix/Detox). Screenshots of each test run are saved to `e2e/artifacts` for review.

To run the e2e tests:

```
yarn detox-setup ## only needs to be run once
yarn build:e2e:ios ## needs to be run after any code change
yarn test:e2e:iphone{11, -se, 8}
```

### Manual Device Testing

Mobile devices come in many different shapes and sizes - it is important to test your code on a variety of simulators to ensure it looks correct on all device types.

Before pushing up code, it is recommended to manually test your code on the following devices:

- Nexus 4 (smaller screen)
- iPhone 8 (smaller screen)
- Pixel 3 XL (larger screen)
- iPhone 11 (screen w/ notch)
