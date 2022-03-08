import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../api';
import { User } from '../types';
import { avatarTag, toast } from '../utils';

interface IAuthContext {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signin: (token: string) => unknown;
  signout: () => unknown;
  updateData: (data: Partial<User>) => unknown;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Sign the user out and clear their token from AsyncStorage
  const signout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(t('error.unexpectedPrimary', t('error.unexpectedSecondary')));
    }
  }, [t]);

  // Sign the user in and save their token to AsyncStorage
  const signin = useCallback(async (token: string) => {
    try {
      await AsyncStorage.setItem('token', token);
      const response = await api.getCurrentUser();
      if (!response.user) return signout();
      const [avatar] = await api.getMediasByTag(avatarTag + response.user.user_id);
      setUser({ ...response.user, avatar });
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(t('error.unexpectedPrimary', t('error.unexpectedSecondary')));
    }
  }, [signout, t]);

  // Validate the token persisted in AsyncStorage
  const initialize = useCallback(async () => {
    try {
      const tokenFromStorage = await AsyncStorage.getItem('token');
      if (!tokenFromStorage) return signout();
      const response = await api.getCurrentUser();
      if (!response.user) return signout();
      const [avatar] = await api.getMediasByTag(avatarTag + response.user.user_id);
      response.user.avatar = avatar;
      return signin(tokenFromStorage);
    } catch (error) {
      return signout();
    }
  }, [signin, signout]);

  // Run the initialize function once on app launch
  useEffect(() => {
    initialize().then(() => setIsLoading(false));
  }, [initialize]);

  // Update the user data
  const updateData = (data: Partial<User>) => {
    setUser(prevState => prevState ? ({ ...prevState, ...data }) : prevState);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, signin, signout, updateData }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
