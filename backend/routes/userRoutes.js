import express from 'express'
import { findNearbyBusinesses, register } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post("/register",register);
userRouter.get("/find-businesses",findNearbyBusinesses);

export default userRouter