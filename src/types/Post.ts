import { Media } from './Media';
import { User } from './User';
import { Rating } from './Rating';
import { Comment } from './Comment';

export interface Post extends Media {
  user: User;
  hasRated: boolean;
  ratings: Rating[];
  comments: Comment[];
}
