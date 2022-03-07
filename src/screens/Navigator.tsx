import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import {
  House as HomeIcon,
  Storefront as MarketIcon,
  PlusCircle as NewIcon,
  User as ProfileIcon,
  Gear as SettingsIcon,
} from 'phosphor-react-native';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import MediaScreen from './MediaScreen';
import UserScreen from './UserScreen';
import HomeScreen from './HomeScreen';
import MarketScreen from './MarketScreen';
import NewScreen from './NewScreen';
import SettingsScreen from './SettingsScreen';
import { ParamList } from '../types';
import { useAuth } from '../hooks';
import { MediaProvider } from '../context';

const UnauthenticatedStack = createNativeStackNavigator<ParamList.Unauthenticated>();
const AuthenticatedStack = createNativeStackNavigator<ParamList.Authenticated>();
const BottomTab = createBottomTabNavigator<ParamList.Tabs>();

const TabScreens = () => {
  const { t } = useTranslation();
  return (
    <BottomTab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarActiveTintColor: '#3366ff' }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: HomeIcon, headerTitle: t('tab.home') }}
      />
      <BottomTab.Screen
        name="Market"
        component={MarketScreen}
        options={{ tabBarIcon: MarketIcon, headerTitle: t('tab.market') }}
      />
      <BottomTab.Screen
        name="New"
        component={NewScreen}
        options={{ tabBarIcon: NewIcon, headerTitle: t('tab.new') }}
      />
      <BottomTab.Screen
        name="Profile"
        component={UserScreen}
        options={{ tabBarIcon: ProfileIcon, headerTitle: t('tab.profile') }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: SettingsIcon, headerTitle: t('tab.setting') }}
      />
    </BottomTab.Navigator>
  );
};

const Navigator = () => {
  const auth = useAuth();
  if (auth.isLoading) return null;
  return (
    <NavigationContainer>
      {auth.isAuthenticated ? (
        <MediaProvider>
          <AuthenticatedStack.Navigator>
            <AuthenticatedStack.Screen name="Tabs" component={TabScreens} options={{ headerShown: false }} />
            <AuthenticatedStack.Screen name="Media" component={MediaScreen} options={{ headerTitle: '' }} />
            <AuthenticatedStack.Screen name="User" component={UserScreen} options={{ headerTitle: '' }} />
          </AuthenticatedStack.Navigator>
        </MediaProvider>
      ) : (
        <UnauthenticatedStack.Navigator>
          <UnauthenticatedStack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
          <UnauthenticatedStack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        </UnauthenticatedStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigator;
