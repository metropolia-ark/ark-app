import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as api from '../api';
import { Media, MediaWithMetadata } from '../types';
import { avatarTag, petTag, postTag, toast } from '../utils';

interface IMediaContext {
  isLoading: boolean;
  isRefreshing: boolean;
  data: Record<number, MediaWithMetadata | undefined>;
  refresh: (media?: MediaWithMetadata) => unknown;
  updateData: (id: number, media: MediaWithMetadata | undefined) => unknown;
}

const MediaContext = createContext<IMediaContext | undefined>(undefined);

const MediaProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState<Record<number, MediaWithMetadata | undefined>>({});

  // Fetch metadata for a media
  const fetchMetadata = useCallback(async (media: Media, tag: string) => {
    const user = await api.getUser(media.user_id);
    const ratings = await api.getRatings(media.file_id);
    const comments = await api.getComments(media.file_id);
    const [avatar] = await api.getMediasByTag(avatarTag + user.user_id);
    return { ...media, tag, user: { ...user, avatar }, ratings, comments };
  }, []);

  // Fetch all media
  const fetchAll = useCallback(async () => {
    try {
      const posts = await api.getMediasByTag(postTag);
      const pets = await api.getMediasByTag(petTag);
      const postsWithMetadata: Record<number, MediaWithMetadata> = {};
      const petsWithMetadata: Record<number, MediaWithMetadata> = {};
      for (const post of posts) {
        postsWithMetadata[post.file_id] = await fetchMetadata(post, postTag);
      }
      for (const pet of pets) {
        petsWithMetadata[pet.file_id] = await fetchMetadata(pet, petTag);
      }
      setData({ ...postsWithMetadata, ...petsWithMetadata });
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(t('error.unexpectedPrimary', t('error.unexpectedSecondary')));
    }
  }, [fetchMetadata, t]);

  // Fetch one media by its id
  const fetchOne = useCallback(async (mediaId: number, tag: string) => {
    try {
      const media = await api.getMedia(mediaId);
      const mediaWithMetadata = await fetchMetadata(media, tag);
      setData(prevState => ({ ...prevState, [mediaWithMetadata.file_id]: mediaWithMetadata }));
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(t('error.unexpectedPrimary', t('error.unexpectedSecondary')));
    }
  }, [fetchMetadata, t]);

  // Fetch all media once on app launch
  useEffect(() => {
    fetchAll().then(() => setIsLoading(false));
  }, [fetchAll]);

  // Refresh one or all media
  const refresh = async (media?: MediaWithMetadata) => {
    setIsRefreshing(true);
    if (media) {
      await fetchOne(media.file_id, media.tag);
    } else {
      await fetchAll();
    }
    setIsRefreshing(false);
  };

  // Update one media by its id
  const updateData = (id: number, media: MediaWithMetadata | undefined) => {
    setData(prevState => ({ ...prevState, [id]: media }));
  };

  return (
    <MediaContext.Provider value={{ isLoading, isRefreshing, refresh, updateData, data }}>
      {children}
    </MediaContext.Provider>
  );
};

export { MediaContext, MediaProvider };
