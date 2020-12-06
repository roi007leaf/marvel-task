import request from 'supertest';

import { app } from '../../app';
import { ActorCharacters } from '../../interfaces';

it('get only actors with more than one character', async () => {
  const response = await request(app)
    .get('/actor/more-than-one-character')
    .send()
    .expect(200);
  const data = response.body;

  expect(
    data.some((actor: ActorCharacters) => actor.name === 'Black Panther')
  ).toBe(false);
});

it('should return true for roles with more than one actor', async () => {
  const response = await request(app)
    .get('/actor/roles-with-more-than-one-actor')
    .send()
    .expect(200);
  const data = response.body;

  expect(data).toBe(false);
});
