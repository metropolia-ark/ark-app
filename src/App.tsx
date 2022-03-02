import React from 'react';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import Navigator from './screens/Navigator';
import { AuthProvider } from './context/AuthContext';
import { PostsProvider } from './context/PostsContext';

const App = () => {
  return (
    <AuthProvider>
      <PostsProvider>
        <ApplicationProvider {...eva} theme={eva.light}>
          <Navigator />
          <StatusBar style="auto" />
        </ApplicationProvider>
      </PostsProvider>
    </AuthProvider>
  );
};

registerRootComponent(App);
