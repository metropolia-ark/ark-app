import { useContext } from 'react';
import { AuthContext } from '../context';

// Get the currently signed-in user
export const useUser = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('AuthProvider is not in scope.');
  if (!auth.user) throw new Error('The user is not signed in.');
  return auth.user;
};
