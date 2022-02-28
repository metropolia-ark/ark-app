import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Get token, authentication status and helper functions
export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('AuthProvider is not in scope.');
  const { token, isLoading, isAuthenticated, signin, signout } = auth;
  return { token, isLoading, isAuthenticated, signin, signout };
};
