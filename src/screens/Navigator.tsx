import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  House as HomeIcon,
  Storefront as MarketIcon,
  PlusCircle as NewIcon,
  User as ProfileIcon,
  Gear as SettingsIcon,
} from 'phosphor-react-native';
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
import { useAuth } from '../hooks';

const UnauthenticatedStack = createNativeStackNavigator<ParamList.Unauthenticated>();
const AuthenticatedStack = createNativeStackNavigator<ParamList.Authenticated>();
const BottomTab = createBottomTabNavigator<ParamList.Tabs>();

const TabScreens = () => (
  <BottomTab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarActiveTintColor: '#009eff' }}>
    <BottomTab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: HomeIcon }} />
    <BottomTab.Screen name="Market" component={MarketScreen} options={{ tabBarIcon: MarketIcon }} />
    <BottomTab.Screen name="New" component={NewScreen} options={{ tabBarIcon: NewIcon }} />
    <BottomTab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ProfileIcon }} />
    <BottomTab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: SettingsIcon }} />
  </BottomTab.Navigator>
);

const Navigator = () => {
  const auth = useAuth();
  if (auth.isLoading) return null;
  return (
    <NavigationContainer>
      {auth.isAuthenticated ? (
        <AuthenticatedStack.Navigator>
          <AuthenticatedStack.Screen name="Tabs" component={TabScreens} options={{ headerShown: false }} />
          <AuthenticatedStack.Screen name="User" component={UserScreen} />
          <AuthenticatedStack.Screen name="Post" component={PostScreen} />
          <AuthenticatedStack.Screen name="Pet" component={PetScreen} />
        </AuthenticatedStack.Navigator>
      ) : (
        <UnauthenticatedStack.Navigator>
          <UnauthenticatedStack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ headerShown: false, headerTitle: 'Sign in' }}
          />
          <UnauthenticatedStack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false, headerTitle: 'Sign up' }}
          />
        </UnauthenticatedStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigator;
