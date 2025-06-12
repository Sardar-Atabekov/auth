import { Router } from 'express';
import authRoutes from './auth'; // подключаем подроуты

const router = Router();

router.use('/user', authRoutes);

export default router;
