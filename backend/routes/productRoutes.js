import express from 'express'
import authMiddleware from '../middleware/jwt.js';
import { addProduct, getProduct, getProviderProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post("/add-product",authMiddleware,addProduct)
productRouter.get("/get-product",authMiddleware,getProduct);
productRouter.post("/get-provider-products",getProviderProduct);

export default productRouter