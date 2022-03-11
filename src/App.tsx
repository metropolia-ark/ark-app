import React, { Suspense } from 'react';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import './utils/i18n';
import { AuthProvider } from './context';
import Navigator from './screens/Navigator';
import { Spinner } from './components';

const App = () => (
  <Suspense fallback={<Spinner fullScreen />}>
    <AuthProvider>
      <ApplicationProvider {...eva} theme={eva.light}>
        <Navigator />
        <StatusBar style="auto" />
        <Toast />
      </ApplicationProvider>
    </AuthProvider>
  </Suspense>
);

registerRootComponent(App);
