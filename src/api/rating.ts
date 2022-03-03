import { Method, request } from '../utils';
import { Rating } from '../types';

// Response type definitions
type GetRatingsResponse = Rating[];
type CreateRatingResponse = { message: string; rating_id: number };
type DeleteRatingResponse = { message: string };

// Get a list of ratings
export const getRatings = (file_id: number) => {
  return request<GetRatingsResponse>(Method.GET, `/ratings/file/${file_id}`);
};

// Create a new rating
export const createRating = (file_id: number, rating: number) => {
  return request<CreateRatingResponse>(Method.POST, '/ratings', { file_id, rating });
};

// Delete a rating
export const deleteRating = (file_id: number) => {
  return request<DeleteRatingResponse>(Method.DELETE, `/ratings/file/${file_id}`);
};
