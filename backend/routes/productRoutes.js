import express from 'express'
import authMiddleware from '../middleware/jwt.js';
import { addProduct, getProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post("/add-product",authMiddleware,addProduct)
productRouter.get("/get-product",authMiddleware,getProduct);

export default productRouter