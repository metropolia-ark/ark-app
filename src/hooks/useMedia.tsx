import { useContext } from 'react';
import { MediaContext } from '../context';

// Get all media
export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) throw new Error('MediaProvider is not in scope.');
  return context;
};
