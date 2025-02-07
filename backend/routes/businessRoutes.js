import express from 'express'
import { addBusiness, getAllBusiness, getBusinessByCategory, getBusinessById, getProviderDetails, updateBusinessDetails } from '../controllers/businessController.js';
import authMiddleware from '../middleware/jwt.js';

const businessRouter = express.Router();

businessRouter.get("/all-business",getAllBusiness)
businessRouter.post("/add-business",addBusiness)
businessRouter.post("/get-business",getBusinessById)
businessRouter.post("/get-business-by-category",getBusinessByCategory)
businessRouter.get("/get-provider-details",authMiddleware,getProviderDetails)
businessRouter.put("/update-business-details", authMiddleware,updateBusinessDetails)

export default businessRouter