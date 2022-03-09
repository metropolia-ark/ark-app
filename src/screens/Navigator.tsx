import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { House, Storefront, PlusCircle, User, Gear } from 'phosphor-react-native';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import MediaScreen from './MediaScreen';
import UserScreen from './UserScreen';
import PostsScreen from './PostsScreen';
import MarketScreen from './MarketScreen';
import NewScreen from './NewScreen';
import SettingsScreen from './SettingsScreen';
import { ParamList } from '../types';
import { useAuth } from '../hooks';
import { MediaProvider } from '../context';
import { SafeAreaView, StyleSheet } from 'react-native';

const UnauthenticatedStack = createNativeStackNavigator<ParamList.Unauthenticated>();
const AuthenticatedStack = createNativeStackNavigator<ParamList.Authenticated>();
const BottomTab = createBottomTabNavigator<ParamList.Tabs>();

const TabScreens = () => {
  const { t } = useTranslation();
  return (
    <BottomTab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarActiveTintColor: '#3366ff' }}>
      <BottomTab.Screen
        name="Posts"
        component={PostsScreen}
        options={{ tabBarIcon: House, headerTitle: t('tab.posts') }}
      />
      <BottomTab.Screen
        name="Market"
        component={MarketScreen}
        options={{ tabBarIcon: Storefront, headerTitle: t('tab.market') }}
      />
      <BottomTab.Screen
        name="New"
        component={NewScreen}
        options={{ tabBarIcon: PlusCircle, headerTitle: t('tab.new') }}
      />
      <BottomTab.Screen
        name="Profile"
        component={UserScreen}
        options={{ tabBarIcon: User, headerTitle: t('tab.profile') }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: Gear, headerTitle: t('tab.setting') }}
      />
    </BottomTab.Navigator>
  );
};

const Navigator = () => {
  const auth = useAuth();
  if (auth.isLoading) return null;
  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ container: { flex: 1 } });

export default Navigator;
