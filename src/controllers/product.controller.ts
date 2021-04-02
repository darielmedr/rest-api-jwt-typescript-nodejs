import { Request, Response } from "express";

class ProductController {
    constructor() { }

    public getProducts(req: Request, res: Response) {
        res.send('Admins only');
    }
}

const productController = new ProductController();
export default productController;