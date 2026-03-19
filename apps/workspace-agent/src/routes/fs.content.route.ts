import { Router } from 'express';
import { getFileTree, readFile, writeFile } from '../controllers/fs.content.controller';

const router = Router();

router.get('/tree', getFileTree);
router.get('/read', readFile);
router.put('/write', writeFile);

export default router;