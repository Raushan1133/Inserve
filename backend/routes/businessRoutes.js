import express from 'express'
import { addBusiness, getAllBusiness, getBusinessByCategory, getBusinessById } from '../controllers/businessController.js';

const businessRouter = express.Router();

businessRouter.get("/all-business",getAllBusiness)
businessRouter.post("/add-business",addBusiness)
businessRouter.post("/get-business",getBusinessById)
businessRouter.post("/get-business-by-category",getBusinessByCategory)

export default businessRouter