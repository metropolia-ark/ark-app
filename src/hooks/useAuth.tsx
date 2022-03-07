import { useContext } from 'react';
import { AuthContext } from '../context';

// Get authentication status and helper functions
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider is not in scope.');
  return context;
};
