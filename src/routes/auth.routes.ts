import { Router } from 'express';
import userController from '../controllers/user.controller';

const router: Router = Router();

router.post('/signin', userController.singIn);
router.post('/signup', userController.singUp);

export default router;