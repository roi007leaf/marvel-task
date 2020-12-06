import Cast from './Cast';

export default interface Movie {
  id: string;
  cast?: Cast[];
}
