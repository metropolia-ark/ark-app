import { useContext } from 'react';
import { MediaContext } from '../context';
import { timeSort } from '../utils';
import { MediaWithMetadata } from '../types';

// Get all media by their tag
export const useMedia = (tag: string) => {
  const context = useContext(MediaContext);
  if (!context) throw new Error('MediaProvider is not in scope.');
  const { isLoading, isRefreshing, refresh, updateData, data } = context;
  const refreshWithTag = (mediaId?: number) => refresh(tag, mediaId);
  const updateDataWithTag = (id: number, media: MediaWithMetadata) => updateData(tag, id, media);
  const sortedData = timeSort(Object.values(data[tag]));
  return { isLoading, isRefreshing, refresh: refreshWithTag, updateData: updateDataWithTag, data: sortedData };
};
