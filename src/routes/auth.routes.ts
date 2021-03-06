import { Router } from 'express';
import userController from '../controllers/user.controller';

const router: Router = Router();

router.post('/signin', userController.singIn);
router.post('/signup', userController.singUp);

router.put('/reset-password', userController.resetPassword);
router.put('/change-password', userController.changePassword);

export default router;