import 'express-async-errors';

import { json } from 'body-parser';
import express from 'express';

import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { actorRouter, movieRouter } from './routes';

const app = express();
app.use(json());

app.use(movieRouter);
app.use(actorRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
