import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import PostScreen from './PostScreen';
import PetScreen from './PetScreen';
import UserScreen from './UserScreen';
import HomeScreen from './HomeScreen';
import MarketScreen from './MarketScreen';
import NewScreen from './NewScreen';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import { ParamList } from '../types';

const UnauthenticatedStack = createNativeStackNavigator<ParamList.Unauthenticated>();
const AuthenticatedStack = createNativeStackNavigator<ParamList.Authenticated>();
const BottomTab = createBottomTabNavigator<ParamList.Tabs>();

const TabScreens = () => (
  <BottomTab.Navigator>
    <BottomTab.Screen name="Home" component={HomeScreen} />
    <BottomTab.Screen name="Market" component={MarketScreen} />
    <BottomTab.Screen name="New" component={NewScreen} />
    <BottomTab.Screen name="Profile" component={ProfileScreen} />
    <BottomTab.Screen name="Settings" component={SettingsScreen} />
  </BottomTab.Navigator>
);

const Navigator = () => {
  const isAuthenticated = true;
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AuthenticatedStack.Navigator>
          <AuthenticatedStack.Screen name="Tabs" component={TabScreens} options={{ headerShown: false }} />
          <AuthenticatedStack.Screen name="User" component={UserScreen} />
          <AuthenticatedStack.Screen name="Post" component={PostScreen} />
          <AuthenticatedStack.Screen name="Pet" component={PetScreen} />
        </AuthenticatedStack.Navigator>
      ) : (
        <UnauthenticatedStack.Navigator>
          <UnauthenticatedStack.Screen name="SignIn" component={SignInScreen} />
          <UnauthenticatedStack.Screen name="SignUp" component={SignUpScreen} />
        </UnauthenticatedStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigator;
