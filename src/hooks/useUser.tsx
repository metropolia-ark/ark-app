import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Get the signed-in user
export const useUser = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('AuthProvider is not in scope.');
  return auth.user;
};
