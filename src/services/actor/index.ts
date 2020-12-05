import { IActorCharacters, ICast, IMovie } from '../../interfaces';
import IRoleCharacters from '../../interfaces/IRolesCharacters';
import MovieService from '../movie';

export default class ActorService {
  private movieService = new MovieService();

  getMoviesForActors(movies: [object], actors: string[]) {
    const moviesFilteredByActors = this.movieService.whichMoviesDidEachActorPlayIn(
      movies,
      actors
    );
    return this.findActorsThatPlayedMoreThanOneCharacter(
      moviesFilteredByActors,
      actors
    );
  }

  async findActorsThatPlayedMoreThanOneCharacter(
    movies: object,
    actorsToFind: string[]
  ): Promise<IActorCharacters[]> {
    return Promise.all(
      await Object.entries(movies).map(async ([key, value]) => {
        const movieCast: ICast[] = await this.movieService.getMovieActorsById(
          value
        );
        const onlyActors = this.movieService.getActorsFromFullCast(movieCast);
        return { id: key, cast: onlyActors };
      })
    ).then((responses) => {
      const filteredMovies = this.movieService.filterByActorsList(
        actorsToFind,
        responses
      );
      return this.getCharactersOfActors(filteredMovies, actorsToFind).filter(
        (actor) => actor.characters.length > 1
      );
    });
  }

  getCharactersOfActors(
    movies: IMovie[],
    actors: string[]
  ): IActorCharacters[] {
    const actorsAndTheirCharacters = actors.map((name) => {
      const characters: string[] = [];
      movies.forEach((movie) => {
        return movie.cast?.forEach((actor) => {
          if (
            actor.original_name === name &&
            characters.indexOf(actor.character) === -1
          ) {
            characters.push(actor.character);
          }
        });
      });
      return { name, characters };
    });
    return actorsAndTheirCharacters;
  }

  async mapRoleToCharacters(
    movies: object,
    actorsToFind: string[]
  ): Promise<boolean> {
    const rolesMap: IRoleCharacters = {};
    return Promise.all(
      await Object.entries(movies).map(async ([key, value]) => {
        const movieCast: ICast[] = await this.movieService.getMovieActorsById(
          value
        );
        const onlyActors = this.movieService.getActorsFromFullCast(movieCast);
        return { id: key, cast: onlyActors };
      })
    ).then((responses) => {
      const filteredMovies = this.movieService.filterByActorsList(
        actorsToFind,
        responses
      );
      filteredMovies.forEach((movie) => {
        movie.cast?.forEach((actor: ICast) => {
          if (!rolesMap[actor.character]) {
            rolesMap[actor.character] = [];
          } else if (
            rolesMap[actor.character].indexOf(actor.original_name) === -1
          ) {
            rolesMap[actor.character].push(actor.original_name);
          }
        });
      });
      return this.checkIfThereIsAnyRoleWithMoreThanOneActorPlayingIt(rolesMap);
    });
  }

  checkIfThereIsAnyRoleWithMoreThanOneActorPlayingIt(
    rolesObject: IRoleCharacters
  ): boolean {
    for (const key of Object.keys(rolesObject)) {
      if (rolesObject[key].length > 1) {
        return true;
      }
    }
    return false;
  }
}
