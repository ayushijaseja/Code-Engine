import { Router } from 'express';
import { launchWorkspace, stopWorkspace } from '../controllers/workspace.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/stop', requireAuth, stopWorkspace);
router.post('/launch', requireAuth, launchWorkspace);

export default router;