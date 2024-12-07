import express from 'express'
import { addBusinessWithCategory } from '../controllers/businessController.js';

const businessRouter = express.Router();

businessRouter.get("/setsamplebusiness",addBusinessWithCategory )

export default businessRouter