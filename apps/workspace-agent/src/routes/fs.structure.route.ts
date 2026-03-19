import { Router } from 'express';
import { createNode, deleteNode, renameNode } from '../controllers/fs.structure.controller';

const router = Router();

router.post('/create', createNode);  
router.delete('/delete', deleteNode); 
router.put('/rename', renameNode);

export default router;