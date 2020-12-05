import axios, { AxiosResponse } from 'axios';

import { IActorMovieMap, ICast, IMovie } from '../../interfaces';

export default class MovieService {
  movieActorsById: IMovie[] = [];

  private host = 'https://api.themoviedb.org/3/movie/';

  async getMovieActorsById(movieId: number): Promise<ICast[]> {
    const response: AxiosResponse<any> = await axios.get(
      `${this.host}${movieId}/credits?api_key=${process.env.API_KEY}`
    );
    return response.data.cast;
  }

  async whichMoviesDidEachActorPlayIn(
    movies: object,
    actorsToFind: string[]
  ): Promise<IActorMovieMap[]> {
    return Promise.all(
      await Object.entries(movies).map(async ([key, value]) => {
        const movieCast: ICast[] = await this.getMovieActorsById(value);
        const onlyActors = this.getActorsFromFullCast(movieCast);
        return { id: key, cast: onlyActors };
      })
    ).then((responses) => {
      const filteredMovies = this.filterByActorsList(actorsToFind, responses);
      return this.mapMovieNamesPerActor(filteredMovies, actorsToFind);
    });
  }

  filterByActorsList(actorsToFilter: string[], movies: IMovie[]): IMovie[] {
    return movies.map((movie) => {
      const cast = movie.cast?.filter((actor) => {
        return actorsToFilter.includes(actor.original_name);
      });
      return { id: movie.id, cast };
    });
  }

  getActorsFromFullCast(cast: ICast[]): ICast[] {
    return cast.filter(
      (castMember) => castMember.known_for_department.toLowerCase() === 'acting'
    );
  }

  mapMovieNamesPerActor(
    filteredMovies: IMovie[],
    actors: string[]
  ): IActorMovieMap[] {
    return actors.map((name) => {
      const movies: string[] = [];
      filteredMovies.forEach((movie) => {
        return movie.cast?.forEach((actor) => {
          if (actor.original_name === name) {
            movies.push(movie.id);
          }
        });
      });
      return { actor: name, movies };
    });
  }
}
