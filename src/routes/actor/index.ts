import express, { Request, Response } from 'express';

import { actorController } from '../../controllers';

const router = express.Router({
  strict: true
});

router.get('/actor/moreThanOneCharacter', (req: Request, res: Response) => {
  return actorController.whoPlayedMoreThanOneCharacter(req, res);
});

router.get(
  '/actor/rolesWithMoreThanOneActor',
  (req: Request, res: Response) => {
    return actorController.isThereARoleWithMoreThanOneActor(req, res);
  }
);

export { router as actorRouter };
