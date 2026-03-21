import { Router } from 'express';
import { register, login, deleteAccount } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/delete', requireAuth, deleteAccount);

export default router;