import express from 'express'
import { addCategory, allCategoryList } from '../controllers/categoryController.js';

const categoryRouter = express.Router();
categoryRouter.get("/all-category",allCategoryList);
categoryRouter.post("/add-category",addCategory);

export default categoryRouter 