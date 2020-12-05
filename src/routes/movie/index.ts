import express, { Request, Response } from 'express';

import { movieController } from '../../controllers';

const router = express.Router({
  strict: true
});

router.get('/movie', (req: Request, res: Response) => {
  return movieController.whichMoviesDidEachActorPlayIn(req, res);
});

export { router as movieRouter };
