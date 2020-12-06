import express, { Request, Response } from 'express';

import { actorController } from '../../controllers';

const router = express.Router({
  strict: true
});

router.get('/actor/more-than-one-character', (req: Request, res: Response) => {
  return actorController.whoPlayedMoreThanOneCharacter(req, res);
});

router.get(
  '/actor/roles-with-more-than-one-actor',
  (req: Request, res: Response) => {
    return actorController.isThereARoleWithMoreThanOneActor(req, res);
  }
);

export { router as actorRouter };
