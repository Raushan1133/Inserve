import express from 'express'
import { addBooking, cancelBookingByProvider, cancelBookingByUser, getBookedSlot, getBookings, sendMailForUpdateBooking, updateBooking } from '../controllers/bookingController.js';
import authMiddleware from '../middleware/jwt.js';

const bookingRouter = express.Router();

bookingRouter.post("/add-booking",authMiddleware,addBooking);
bookingRouter.post("/get-booked-slot",authMiddleware,getBookedSlot);
bookingRouter.get("/get-bookings",authMiddleware,getBookings);
bookingRouter.patch("/cancel-booking-by-user",cancelBookingByUser);
bookingRouter.post("/send-cancel-otp",sendMailForUpdateBooking);
bookingRouter.patch("/cancel-booking-by-provider",cancelBookingByProvider);
bookingRouter.patch("/update-status",updateBooking)

export default bookingRouter