import { MediaWithMetadata } from '../types';

// Filter media list and sort by upload time
export const filter = (data: Record<number, MediaWithMetadata>, filters: Partial<MediaWithMetadata>) => {
  return Object.values(data)
    .filter(item => {
      return Object.entries(filters).reduce((acc: boolean, [key, value]) => {
        return acc && item[key as keyof MediaWithMetadata] === value;
      }, true);
    })
    .sort((a, b) => new Date(a.time_added) < new Date(b.time_added) ? 1 : -1);
};
