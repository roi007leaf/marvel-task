import { Cast, Movie, RoleCharacters } from '../../interfaces';
import MovieService from '../movie';

class ToolsService {
  /**
   * get movie actors for movies list
   * @param movies
   */
  public async getActorsForAllMovies(movies: object): Promise<Movie[]> {
    return Promise.all(
      Object.entries(movies).map(async ([key, value]) => {
        const movieCast: Cast[] = await MovieService.getMovieActorsById(value);
        const onlyActors = this.getActorsFromFullCast(movieCast);
        return { id: key, cast: onlyActors };
      })
    );
  }

  /**
   * get actors cast from all of the cast
   * @param cast
   */
  private getActorsFromFullCast(cast: Cast[]): Cast[] {
    return cast.filter(
      (castMember) => castMember.known_for_department.toLowerCase() === 'acting'
    );
  }

  public doesStringContainsSubstringFromArray(
    str: string,
    rolesMap: RoleCharacters
  ): boolean {
    return this.iterateThroughObjectKeysByWordsToFindSubstrings(rolesMap, str);
  }

  /**
   * find substrings of object keys in a a string
   * @param obj
   * @param str
   */
  private iterateThroughObjectKeysByWordsToFindSubstrings(
    obj: object,
    str: string
  ): boolean {
    const substringKeys = Object.keys(obj).filter((value) => {
      const splitValue = value.split('/');
      return str.includes(splitValue[0]);
    });
    return !!substringKeys;
  }
}

export default new ToolsService();
