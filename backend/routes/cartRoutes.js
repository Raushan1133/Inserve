import express from 'express'
import authMiddleware from '../middleware/jwt.js';
import { addToCart, decreaseQty, deleteCartItems, getCart, increaseQty } from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.post("/add-to-cart",authMiddleware,addToCart);
cartRouter.get("/get-cart",authMiddleware,getCart);
cartRouter.post("/delete-cart",authMiddleware,deleteCartItems);
cartRouter.patch("/increase-qty",authMiddleware,increaseQty);
cartRouter.patch("/decrease-qty",authMiddleware,decreaseQty);
export default cartRouter