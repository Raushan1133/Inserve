import express from 'express'
import { findNearbyBusinesses, getUserById, register } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post("/register",register);
userRouter.post("/find-businesses",findNearbyBusinesses);
userRouter.post("/get-user-by-id",getUserById);

export default userRouter