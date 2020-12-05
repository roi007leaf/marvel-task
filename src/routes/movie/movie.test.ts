import request from 'supertest';

import { app } from '../../app';

it('show corredct list of movies pre actor', async () => {
  const response = await request(app).get('/movie').send().expect(200);

  expect(JSON.parse(response.text)[0].actor).toEqual('Robert Downey Jr.');
  expect(JSON.parse(response.text)[0].movies).toEqual([
    'Iron Man',
    'The Incredible Hulk',
    'Iron Man 2',
    'The Avengers',
    'Iron Man 3',
    'Avengers: Age of Ultron',
    'Captain America: Civil War',
    'Spider-Man: Homecoming',
    'Avengers: Infinity War',
    'Avengers: Endgame'
  ]);
});
