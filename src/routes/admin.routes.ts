import { Router } from 'express';
import productController from '../controllers/product.controller';

const router: Router = Router();

router.get('/product', productController.getProducts);

export default router;