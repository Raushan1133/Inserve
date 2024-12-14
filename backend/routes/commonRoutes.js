import express from 'express'
import { getUserDetails, login, logout } from '../controllers/CommonController.js';
import authMiddleware from '../middleware/jwt.js';

const commonRouter = express.Router();

commonRouter.get("/get-user-details",authMiddleware,getUserDetails)
commonRouter.post("/login",login);
commonRouter.get("/logout",logout);
export default commonRouter