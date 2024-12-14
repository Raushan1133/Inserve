import express from 'express'
import { addBusiness } from '../controllers/businessController.js';

const businessRouter = express.Router();

businessRouter.post("/add-business",addBusiness)

export default businessRouter