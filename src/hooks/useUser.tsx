import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Get the signed-in user
export const useUser = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('AuthProvider is not in scope.');
  if (!auth.user) throw new Error('User is not signed in.');
  return auth.user;
};
