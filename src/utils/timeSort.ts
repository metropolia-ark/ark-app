import { Media } from '../types';

// Sort medias by their creation time
export const timeSort = <T extends Media>(medias: T[]) => {
  return medias.sort((a, b) => new Date(a.time_added) < new Date(b.time_added) ? 1 : -1);
};
