import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { Comment, Post, Rating } from '../types';
import * as api from '../api';
import { postTag } from '../utils/constants';
import { useUser } from '../hooks/useUser';

interface IPostsContext {
  isLoading: boolean;
  isRefreshing: boolean;
  posts: Record<number, Post>;
  refresh: (postId?: number) => unknown;
  rate: (postId: number) => unknown;
  comment: (postId: number, content: string) => unknown;
}

const PostsContext = createContext<IPostsContext | undefined>(undefined);

const PostsProvider = ({ children }: { children: ReactNode }) => {
  const currentUser = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [posts, setPosts] = useState<Record<number, Post>>([]);

  // Fetch all posts and store them in state
  const fetchPosts = useCallback(async () => {
    if (!currentUser) return;
    const response = await api.getMediasByTag(postTag);
    const sorted = response.sort((a, b) => new Date(a.time_added) < new Date(b.time_added) ? 1 : -1);
    for (const media of sorted) {
      const user = await api.getUser(media.user_id);
      const ratings = await api.getRatings(media.file_id);
      const comments = await api.getComments(media.file_id);
      const hasRated = !!ratings.find(r => r.user_id === currentUser.user_id);
      const post: Post = { ...media, user, hasRated, ratings, comments };
      setPosts(prevState => ({ ...prevState, [post.file_id]: post }));
    }
  }, [currentUser]);

  // Fetch a single post and store it in state
  const fetchPost = useCallback(async (postId: number) => {
    if (!currentUser) return;
    const media = await api.getMedia(postId);
    const user = await api.getUser(media.user_id);
    const ratings = await api.getRatings(media.file_id);
    const comments = await api.getComments(media.file_id);
    const hasRated = !!ratings.find(r => r.user_id === currentUser.user_id);
    const post: Post = { ...media, user, hasRated, ratings, comments };
    setPosts(prevState => ({ ...prevState, [post.file_id]: post }));
  }, [currentUser]);

  // Run the `initialize` function once on app launch
  useEffect(() => {
    fetchPosts().then(() => setIsLoading(false));
  }, [fetchPosts]);

  // Refresh the posts
  const refresh = async (postId?: number) => {
    setIsRefreshing(true);
    await (postId ? fetchPost(postId) : fetchPosts());
    setIsRefreshing(false);
  };

  // Rate a post
  const rate = async (postId: number) => {
    if (!currentUser) return;
    const post = posts[postId];
    if (post) {
      if (post.hasRated) {
        await api.deleteRating(post.file_id);
        const newRatings: Rating[] = post.ratings.filter(r => r.user_id !== currentUser.user_id);
        const updatedPost: Post = { ...post, hasRated: false, ratings: newRatings };
        setPosts(prevState => ({ ...prevState, [postId]: updatedPost }));
      } else {
        const { rating_id } = await api.createRating(post.file_id, 1);
        const newRating: Rating = { rating_id, file_id: post.file_id, user_id: currentUser.user_id, rating: 1 };
        const updatedPost: Post = { ...post, hasRated: true, ratings: [ ...post.ratings, newRating ] };
        setPosts(prevState => ({ ...prevState, [postId]: updatedPost }));
      }
    }
  };

  // Comment on a post
  const comment = async (postId: number, content: string) => {
    if (!currentUser) return;
    const post = posts[postId];
    if (post) {
      const { comment_id } = await api.createComment(post.file_id, content);
      const newComment: Comment = { comment_id, file_id: post.file_id, user_id: currentUser.user_id, comment: content };
      const updatedPost: Post = { ...post, comments: [ ...post.comments, newComment ] };
      setPosts(prevState => ({ ...prevState, [postId]: updatedPost }));
    }
  };

  return (
    <PostsContext.Provider value={{ isLoading, isRefreshing, posts, refresh, rate, comment }}>
      {children}
    </PostsContext.Provider>
  );
};

export { PostsContext, PostsProvider };