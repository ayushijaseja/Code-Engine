import { Router } from 'express';
import { watchFiles } from '../controllers/fs.watcher.controller';

const router = Router();

router.get('/stream', watchFiles);

export default router;