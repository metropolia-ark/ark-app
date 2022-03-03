import { useContext } from 'react';
import { PostsContext } from '../context/PostsContext';

// Get all posts sorted by date in descending order
export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) throw new Error('PostsProvider was not in scope.');
  const { posts, ...rest } = context;
  const sorted = Object.values(posts).sort((a, b) => new Date(a.time_added) < new Date(b.time_added) ? 1 : -1);
  return { ...rest, posts: sorted };
};
