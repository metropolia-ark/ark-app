import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import * as api from '../api';
import { avatarTag } from '../utils';

interface IAuthContext {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signin: (token: string, user: User) => void;
  signout: () => void;
  updateData: (data: Partial<User>) => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Validate the token persisted in AsyncStorage
  const initialize = useCallback(async () => {
    try {
      const tokenFromStorage = await AsyncStorage.getItem('token');
      if (!tokenFromStorage) return signout();
      const response = await api.getCurrentUser();
      if (!response.user) return signout();
      const [avatar] = await api.getMediasByTag(avatarTag + response.user.user_id);
      response.user.avatar = avatar;
      signin(tokenFromStorage, response.user);
    } catch (error) {
      signout();
    }
  }, []);

  // Run the initialize function once on app launch
  useEffect(() => {
    initialize().then(() => setIsLoading(false));
  }, [initialize]);

  // Sign the user in and save their token to AsyncStorage
  const signin = (newToken: string, newUser: User) => {
    setUser(newUser);
    setToken(newToken);
    setIsAuthenticated(true);
    AsyncStorage.setItem('token', newToken).catch(error => {
      console.error('Failed to save the token to AsyncStorage', error);
    });
  };

  // Sign the user out and clear their token from AsyncStorage
  const signout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    AsyncStorage.removeItem('token').catch(error => {
      console.error('Failed to remove the token from AsyncStorage', error);
    });
  };

  // Update the user data
  const updateData = (data: Partial<User>) => {
    setUser(prevState => prevState ? ({ ...prevState, ...data }) : prevState);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated, signin, signout, updateData }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
