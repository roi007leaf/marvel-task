import { ActorCharacters, Cast, Movie, RoleCharacters } from '../../interfaces';
import MovieService from '../movie';
import ToolsService from '../tools';

class ActorService {
  private movieService = MovieService;

  private toolsService = ToolsService;

  public async findActorsThatPlayedMoreThanOneCharacter(
    movies: object,
    actorsToFind: string[]
  ): Promise<ActorCharacters[]> {
    const moviesAndTheirActorsByList = await this.toolsService.getActorsForAllMovies(
      movies
    );
    const filteredMovies = this.movieService.filterByActorsList(
      actorsToFind,
      moviesAndTheirActorsByList
    );
    return this.getCharactersOfActors(filteredMovies, actorsToFind).filter(
      (actor) => actor.characters.length > 1
    );
  }

  private getCharactersOfActors(
    movies: Movie[],
    actors: string[]
  ): ActorCharacters[] {
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

  public async isThereARoleWithMoreThanOneActor(
    movies: object,
    actorsToFind: string[]
  ): Promise<boolean> {
    const moviesAndTheirActors = await this.toolsService.getActorsForAllMovies(
      movies
    );
    const filteredMovies = this.movieService.filterByActorsList(
      actorsToFind,
      moviesAndTheirActors
    );
    const roleToCharactersMap = this.mapRoleToCharacter(filteredMovies);
    const isThereARoleWithMoreThanOneActor = this.checkIfThereIsAnyRoleWithMoreThanOneActorPlayingIt(
      roleToCharactersMap
    );
    return isThereARoleWithMoreThanOneActor.length > 1;
  }

  private checkIfThereIsAnyRoleWithMoreThanOneActorPlayingIt(
    rolesObject: RoleCharacters
  ): string[][] {
    return Object.values(rolesObject).filter((value) => value.length > 1);
  }

  private mapRoleToCharacter(filteredMovies: Movie[]): RoleCharacters {
    const rolesMap: RoleCharacters = {};
    filteredMovies.forEach((movie) => {
      movie.cast?.forEach((actor: Cast) => {
        const characterName = actor.character
          .replace('(uncredited)', '')
          .trim()
          .replace(/['"]+/g, '')
          .split('/')[0]
          .trim();
        if (
          !rolesMap[characterName] ||
          (rolesMap[characterName] &&
            !this.toolsService.doesStringContainsSubstringFromArray(
              characterName,
              rolesMap
            ))
        ) {
          rolesMap[characterName] = [];
          rolesMap[characterName].push(actor.original_name);
        } else if (
          rolesMap[characterName].indexOf(actor.original_name) === -1
        ) {
          rolesMap[characterName].push(actor.original_name);
        }
      });
    });
    return rolesMap;
  }
}

export default new ActorService();
