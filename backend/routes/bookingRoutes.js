import express from 'express'
import { addBooking, cancelBooking, getBookedSlot, getBookings } from '../controllers/bookingController.js';
import authMiddleware from '../middleware/jwt.js';

const bookingRouter = express.Router();

bookingRouter.post("/add-booking",authMiddleware,addBooking);
bookingRouter.post("/get-booked-slot",authMiddleware,getBookedSlot);
bookingRouter.get("/get-bookings",authMiddleware,getBookings);
bookingRouter.post("/cancel-booking",cancelBooking);

export default bookingRouter