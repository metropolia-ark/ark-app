import { Media } from './Media';
import { User } from './User';
import { Rating } from './Rating';
import { Comment } from './Comment';

export interface MediaWithMetadata extends Media {
  tag: string;
  user: User;
  ratings: Rating[];
  comments: Comment[];
}
