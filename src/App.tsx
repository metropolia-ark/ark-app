import React from 'react';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import './utils/i18n';
import { AuthProvider } from './context';
import Navigator from './screens/Navigator';

const App = () => (
  <AuthProvider>
    <ApplicationProvider {...eva} theme={eva.light}>
      <Navigator />
      <StatusBar style="auto" />
      <Toast />
    </ApplicationProvider>
  </AuthProvider>
);

registerRootComponent(App);
