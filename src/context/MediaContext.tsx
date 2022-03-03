import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { avatarTag, petTag, postTag, timeSort } from '../utils';
import { MediaWithMetadata } from '../types';
import * as api from '../api';

interface IMediaContext {
  isLoading: boolean;
  isRefreshing: boolean;
  data: Record<string, Record<number, MediaWithMetadata>>;
  refresh: (tag: string, mediaId?: number) => unknown;
  updateData: (tag: string, id: number, media: MediaWithMetadata) => unknown;
}

const MediaContext = createContext<IMediaContext | undefined>(undefined);

const MediaProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState<Record<string, Record<number, MediaWithMetadata>>>({ [postTag]: {}, [petTag]: {} });

  // Fetch all posts under a tag
  const fetchAll = async (tag: string) => {
    const medias = await api.getMediasByTag(tag);
    const sortedMedias = timeSort(medias);
    for (const media of sortedMedias) {
      const user = await api.getUser(media.user_id);
      const ratings = await api.getRatings(media.file_id);
      const comments = await api.getComments(media.file_id);
      const [avatar] = await api.getMediasByTag(avatarTag + user.user_id);
      const item = { ...media, tag, user, ratings, comments, avatar };
      setData(prevState => ({ ...prevState, [tag]: { ...prevState[tag], [item.file_id]: item } }));
    }
  };

  // Fetch one post under a tag by its id
  const fetchOne = async (tag: string, mediaId: number) => {
    const media = await api.getMedia(mediaId);
    const user = await api.getUser(media.user_id);
    const ratings = await api.getRatings(media.file_id);
    const comments = await api.getComments(media.file_id);
    const [avatar] = await api.getMediasByTag(avatarTag + user.user_id);
    const item = { ...media, tag, user, ratings, comments, avatar };
    setData(prevState => ({ ...prevState, [tag]: { ...prevState[tag], [item.file_id]: item } }));
  };

  // Fetch all post and pet media once on app launch
  useEffect(() => {
    fetchAll(postTag).then(() => fetchAll(petTag)).then(() => setIsLoading(false));
  }, []);

  // Refresh one or all media under a tag
  const refresh = async (tag: string, mediaId?: number) => {
    setIsRefreshing(true);
    await (mediaId ? fetchOne(tag, mediaId) : fetchAll(tag));
    setIsRefreshing(false);
  };

  // Update one media by its id
  const updateData = (tag: string, id: number, media: MediaWithMetadata) => {
    setData(prevState => ({ ...prevState, [tag]: { ...prevState[tag], [id]: media } }));
  };

  return (
    <MediaContext.Provider value={{ isLoading, isRefreshing, refresh, updateData, data }}>
      {children}
    </MediaContext.Provider>
  );
};

export { MediaContext, MediaProvider };
