import express from 'express'
import { addSampleCategories } from '../controllers/categoryController.js';

const categoryRouter = express.Router();

categoryRouter.get("/addsamplecategories",addSampleCategories)

export default categoryRouter 