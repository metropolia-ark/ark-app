import { MediaWithMetadata } from '../types';

type CustomFilter = (media: MediaWithMetadata) => boolean;

// Filter media list and sort by upload time
const filterMedia = (
  data: Record<number, MediaWithMetadata | undefined>,
  filter: Partial<MediaWithMetadata> | CustomFilter,
) => {
  return Object.values(data)
    .filter((item): item is MediaWithMetadata => {
      if (!item) return false;
      if (typeof filter === 'function') return filter(item);
      return Object.entries(filter).reduce((acc: boolean, [key, value]) => {
        return acc && item[key as keyof MediaWithMetadata] === value;
      }, true);
    })
    .sort((a, b) => {
      return new Date(a.time_added) < new Date(b.time_added) ? 1 : -1;
    });
};

export { filterMedia as filter };
