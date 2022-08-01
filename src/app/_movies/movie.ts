import {Director} from "../_directors/director";
import {Genre} from "../_genres/genre";

export class Movie {
  id: number;
  title: string;
  director: Director;
  genres: Array<Genre>;
  year: string;
  description: string;
}
