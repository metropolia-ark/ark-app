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
import { useTranslation } from 'react-i18next';

const UnauthenticatedStack = createNativeStackNavigator<ParamList.Unauthenticated>();
const AuthenticatedStack = createNativeStackNavigator<ParamList.Authenticated>();
const BottomTab = createBottomTabNavigator<ParamList.Tabs>();

const TabScreens = () => {
  const { t } = useTranslation();
  return (
    <BottomTab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarActiveTintColor: '#3366ff' }}>
      <BottomTab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: HomeIcon,
        headerTitle: t('home'),
      }} />
      <BottomTab.Screen name="Market" component={MarketScreen} options={{
        tabBarIcon: MarketIcon,
        headerTitle: t('market'),
      }} />
      <BottomTab.Screen name="New" component={NewScreen} options={{ tabBarIcon: NewIcon, headerTitle: t('new') }} />
      <BottomTab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarIcon: ProfileIcon,
        headerTitle: t('profile'),
      }} />
      <BottomTab.Screen name="Settings" component={SettingsScreen} options={{
        tabBarIcon: SettingsIcon,
        headerTitle: t('setting'),
      }} />
    </BottomTab.Navigator>
  );
};

const Navigator = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  if (auth.isLoading) return null;
  return (
    <NavigationContainer>
      {auth.isAuthenticated ? (
        <AuthenticatedStack.Navigator>
          <AuthenticatedStack.Screen name="Tabs" component={TabScreens} options={{ headerShown: false }} />
          <AuthenticatedStack.Screen name="User" component={UserScreen} options={{ headerTitle: t('user') }}/>
          <AuthenticatedStack.Screen name="Post" component={PostScreen} options={{ headerTitle: t('post') }}/>
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
