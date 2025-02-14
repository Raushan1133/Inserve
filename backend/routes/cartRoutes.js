import express from 'express'
import authMiddleware from '../middleware/jwt.js';
import { addToCart } from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.post("/add-to-cart",authMiddleware,addToCart);
export default cartRouter