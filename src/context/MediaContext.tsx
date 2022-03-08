import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as api from '../api';
import { MediaWithMetadata } from '../types';
import { avatarTag, petTag, postTag, toast } from '../utils';

interface IMediaContext {
  isLoading: boolean;
  isRefreshing: boolean;
  data: Record<number, MediaWithMetadata | null>;
  refresh: (mediaOrTag: MediaWithMetadata | string) => unknown;
  updateData: (id: number, media: MediaWithMetadata | null) => unknown;
}

const MediaContext = createContext<IMediaContext | undefined>(undefined);

const MediaProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState<Record<number, MediaWithMetadata | null>>({});

  // Fetch all posts under a tag
  const fetchAll = useCallback(async (tag: string) => {
    try {
      const medias = await api.getMediasByTag(tag);
      for (const media of medias) {
        const user = await api.getUser(media.user_id);
        const ratings = await api.getRatings(media.file_id);
        const comments = await api.getComments(media.file_id);
        const [avatar] = await api.getMediasByTag(avatarTag + user.user_id);
        const item = { ...media, tag, user: { ...user, avatar }, ratings, comments };
        setData(prevState => ({ ...prevState, [item.file_id]: item }));
      }
    } catch (error) {
      console.error(error);
      toast.error(t('error.unexpectedPrimary', t('error.unexpectedSecondary')));
    }
  }, [t]);

  // Fetch one post under a tag by its id
  const fetchOne = useCallback(async (tag: string, mediaId: number) => {
    try {
      const media = await api.getMedia(mediaId);
      const user = await api.getUser(media.user_id);
      const ratings = await api.getRatings(media.file_id);
      const comments = await api.getComments(media.file_id);
      const [avatar] = await api.getMediasByTag(avatarTag + user.user_id);
      const item = { ...media, tag, user: { ...user, avatar }, ratings, comments };
      setData(prevState => ({ ...prevState, [item.file_id]: item }));
    } catch (error) {
      console.error(error);
      toast.error(t('error.unexpectedPrimary', t('error.unexpectedSecondary')));
    }
  }, [t]);

  // Fetch all post and pet media once on app launch
  useEffect(() => {
    fetchAll(postTag).then(() => fetchAll(petTag)).then(() => setIsLoading(false));
  }, [fetchAll]);

  // Refresh one media or all under a tag
  const refresh = async (mediaOrTag: MediaWithMetadata | string) => {
    setIsRefreshing(true);
    if (typeof mediaOrTag === 'string') {
      await fetchAll(mediaOrTag);
    } else {
      await fetchOne(mediaOrTag.tag, mediaOrTag.file_id);
    }
    setIsRefreshing(false);
  };

  // Update one media by its id
  const updateData = (id: number, media: MediaWithMetadata | null) => {
    setData(prevState => ({ ...prevState, [id]: media }));
  };

  return (
    <MediaContext.Provider value={{ isLoading, isRefreshing, refresh, updateData, data }}>
      {children}
    </MediaContext.Provider>
  );
};

export { MediaContext, MediaProvider };
