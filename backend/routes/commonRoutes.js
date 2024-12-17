import express from 'express'
import { changePassword, getUserDetails, login, logout, updateDetails } from '../controllers/CommonController.js';
import authMiddleware from '../middleware/jwt.js';

const commonRouter = express.Router();

commonRouter.get("/get-user-details",authMiddleware,getUserDetails)
commonRouter.post("/login",login);
commonRouter.get("/logout",logout);
commonRouter.patch("/update-details",updateDetails);
commonRouter.patch("/change-password",changePassword);
export default commonRouter