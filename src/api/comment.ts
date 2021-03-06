import { Method, request } from '../utils';
import { Comment } from '../types';

// Response type definitions
type GetCommentsResponse = Comment[];
type CreateCommentResponse = { message: string; comment_id: number };
type DeleteCommentResponse = { message: string };

// Get a list of comments
export const getComments = (file_id: number) => {
  return request<GetCommentsResponse>(Method.GET, `/comments/file/${file_id}`);
};

// Create a new comment
export const createComment = (file_id: number, comment: string) => {
  return request<CreateCommentResponse>(Method.POST, '/comments', { file_id, comment });
};

// Delete a comment
export const deleteComment = (comment_id: number) => {
  return request<DeleteCommentResponse>(Method.DELETE, `/comments/${comment_id}`);
};
