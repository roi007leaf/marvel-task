import ActorService from './actor';
import MovieService from './movie';

const movieService = new MovieService();
const actorService = new ActorService();

export { movieService, actorService };
