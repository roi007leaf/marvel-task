import { RequestService, ToolsService } from '..';
import { ActorMovieMap, Cast, Movie } from '../../interfaces';

class MovieService {
  movieActorsById: Movie[] = [];

  private toolsService = ToolsService;

  private host = 'https://api.themoviedb.org/3/movie/';

  public async getMovieActorsById(movieId: number): Promise<Cast[]> {
    const response = await RequestService.get(
      `${this.host}${movieId}/credits?api_key=${process.env.API_KEY}`
    );
    return response.data.cast;
  }

  public async whichMoviesDidEachActorPlayIn(
    movies: object,
    actorsToFind: string[]
  ): Promise<ActorMovieMap[]> {
    const moviesAndTheirActors = await this.toolsService.getActorsForAllMovies(
      movies
    );
    const filteredMovies = this.filterByActorsList(
      actorsToFind,
      moviesAndTheirActors
    );
    return this.mapMovieNamesPerActor(filteredMovies, actorsToFind);
  }

  public filterByActorsList(
    actorsToFilter: string[],
    movies: Movie[]
  ): Movie[] {
    return movies.map((movie) => {
      const cast = movie.cast?.filter((actor: Cast) => {
        return actorsToFilter.includes(actor.original_name);
      });
      return { id: movie.id, cast };
    });
  }

  private mapMovieNamesPerActor(
    filteredMovies: Movie[],
    actors: string[]
  ): ActorMovieMap[] {
    return actors.map((name) => {
      const movies: string[] = [];
      filteredMovies.forEach((movie) => {
        return movie.cast?.forEach((actor: Cast) => {
          if (actor.original_name === name) {
            movies.push(movie.id);
          }
        });
      });
      return { actor: name, movies };
    });
  }
}

export default new MovieService();
