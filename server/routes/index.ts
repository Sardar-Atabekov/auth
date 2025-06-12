import { Router } from 'express';
import authRoutes from './auth';

const router = Router();

router.use('/user', authRoutes);

export default router;
