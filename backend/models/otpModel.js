import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Expires after 600 seconds (10 minutes)

});

// Create the model
const otpModel = mongoose.model('Otp', otpSchema);

export default otpModel
