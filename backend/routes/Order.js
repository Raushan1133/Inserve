import authMiddleware from '../middleware/jwt.js';
import express from 'express'
import webhooks from '../controllers/order/webhook.js';
import paymentController from '../controllers/order/payment-controller.js';
import { getOrders } from '../controllers/order/OrderController.js';
// import {getOrders} from '../controllers/order/OrderController.js';
const orderRouter = express.Router();
orderRouter.post("/webhook",webhooks);
orderRouter.post("/checkout",authMiddleware,paymentController);
orderRouter.get("/get-orders",authMiddleware,getOrders);


export default orderRouter