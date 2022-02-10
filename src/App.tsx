import React from 'react';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import Navigator from './screens/Navigator';

const App = () => {
  return (
    <>
      <Navigator />
      <StatusBar style="auto" />
    </>
  );
};

registerRootComponent(App);
