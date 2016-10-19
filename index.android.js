import React from 'react';
import { AppRegistry } from 'react-native';
import App from './app/components/app';

global.React = React;

AppRegistry.registerComponent('wandr2', () => App);
