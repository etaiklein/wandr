![Pepperoni - Empowered by Futurice](/docs/pepperoni.png?v=2)
Futurice React Native Starter Kit
===
[![Build Status](https://travis-ci.org/futurice/pepperoni-app-kit.svg?branch=master)](https://travis-ci.org/futurice/pepperoni-app-kit)
[![React Native](https://img.shields.io/badge/react%20native-0.29-brightgreen.svg)](https://github.com/facebook/react-native)
[![Sponsored](https://img.shields.io/badge/chilicorn-sponsored-brightgreen.svg)](http://spiceprogram.org/oss-sponsorship/)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()

We :green_heart: building apps with React Native, because it helps us create high quality products for both major mobile platforms quickly and cost-effectively.

Getting started on a new app just takes too damn long, though. Most apps need the same basic building blocks and developer infrastructure, and we are bored of reinventing the wheel time and time again.

This Starter Kit reflects the best practices of React Native development we have discovered while building real-world applications for our customers. It is opinionated about tooling, patterns and development practices. It might not be a one-size-fits-all solution for everyone, but feel free to customize it for your needs, or just take inspiration from it.

React Native Starter Kit is a part of [Pepperoni](http://getpepperoni.com), a framework for kickstarting digital product development.

## Contents

:warning: **WORK IN PROGRESS** |
:star: **COMING SOON**

Not all of the below is yet fully implemented

### Application Blueprint

* Always up-to-date [React Native](https://facebook.github.io/react-native/) scaffolding
* Modular and well-documented structure for application code
* [Redux](http://redux.js.org/) and [ImmutableJS](https://facebook.github.io/immutable-js/) for safe and **Reasonaboutable**:tm: state management
* [Redux Loop](https://github.com/raisemarketplace/redux-loop) for Elm-style controlled side effects
* Redux-managed Navigators for Stack-based and Tabbed navigation with NavigationExperimental
* Disk-persisted application state caching for offline support and snappy startup performance
* Clean and testable service layer for interacting with RESTful APIs
* :warning: Sample app to show how to wire it all together
* :star: JSON Web Token authentication
* :star: Multi-environment configuration (dev, staging, production) for iOS and Android
* :star: Built-in error handling and customizable error screens

### Testing Setup

* [Mocha](https://mochajs.org/) for unit testing application code
* [Enzyme](https://github.com/airbnb/enzyme) and fully mocked React Native for unit testing UI components
* [Istanbul](https://github.com/gotwarlost/istanbul) code coverage
* Utilities for end-to-end integration testing Redux state, including side effects and asynchronous actions

### Development & Deployment Infrastructure

* [Auth0](https://auth0.com/) for ready-to-use login and signup screens, user authentication and identity management
* [Bitrise.io](https://www.bitrise.io) configurations for Continuous Integration and beta app distribution
* :warning: [Google Tag Manager](https://www.google.com/analytics/tag-manager/) analytics
* :star: [Microsoft Code Push](http://microsoft.github.io/code-push) for Continuous Deployment and instant app updates

### Roadmap

* **TODO** Crash reporting
* **TODO** Android and iOS UI Testing with Calaba.sh?
* **TODO** Feature flags?

## Getting started

##### Set up development environment
If this is your first time using React Native, set up your React Native development environment following the ["Dependencies" section of React Native Getting Started guide](https://facebook.github.io/react-native/docs/getting-started.html). Note that if you want to develop an app for both iOS and Android, you need to set up the development environment both.

##### Download the code
Once you've got a development environment up and running, you're ready to start building your app. Get the code by forking or mirroring this repository. Because you can't rename a fork, for serious use we recommend [mirroring using these instructions](https://help.github.com/articles/duplicating-a-repository/). To contribute to Pepperoni development or just playing around, forking is the way to go.

Once you have the code downloaded, give your application a name by running `./support/rename.sh YourAppName`.

##### Install dependencies
Before you can run the app, you need is to install the app's dependencies. Execute the following command in the app's root directory:
```
npm install
```

##### Start the application in iOS simulator
```
$ react-native run-ios
```

To run the app on a real iOS device, follow the [official React Native instructions for iOS](https://facebook.github.io/react-native/docs/running-on-device-ios.html).

##### Start the application in Android simulator
```
$ react-native run-android
```

If using the stock emulator, the emulator must be running. You can start it from Android Studio, or opening the Virtual Device manager directly:
```
. $ANDROID_HOME/tools/android avd
```

To run the app on a real Android device, follow the [official React Native instructions for Android](https://facebook.github.io/react-native/docs/running-on-device-android.html).

##### Run unit tests
```
$ npm test
```

##### Run tests every time code changes
```
$ npm run test:watch
```

##### Generate code coverage report
```
$ npm run coverage
```

Read the **[Testing guide](docs/TESTING.md)** for more information about writing tests.

## Development workflow

After you have set up the project using above instructions, you can use your favorite IDE or text editor to write code, and run the application from the command line. Turn on React Native hot module reloading in the app developer menu to refresh your application as you code.

The developer menu can be accessed with `Cmd+D` in iOS Simulator, `Cmd+M` in Android emulator, or by shaking the device.

To learn how to structure your application and use the Redux application architecture, read the **[Architecture guide](docs/ARCHITECTURE.md)** for more details.

## Deployment

Read the **[Deployment guide](docs/DEPLOYMENT.md)** to learn how to deploy the application to test devices, app stores, and how to use Code Push to push updates to your users immediately.

## Contributing

If you find any problems, please [open an issue](https://github.com/futurice/pepperoni-app-kit/issues/new) or submit a fix as a pull request.

We welcome new features, but for large changes let's discuss first to make sure the changes can be accepted and integrated smoothly.

## License

[MIT License](LICENSE)

## Credits

This project was initially motivated by [Snowflake](https://github.com/bartonhammond/snowflake), a React Native boilerplate by Barton Hammond. It shares some features and design principles for Pepperoni, but it wasn't the right fit for our needs. At this time Snowflake is more mature, so if you like Pepperoni but didn't agree with something we are doing, you should check it out to see if it's a good fit for your app.
