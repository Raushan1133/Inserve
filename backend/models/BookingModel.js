import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    date: {
        type: String,
        required : true
    },
    time: {
        type: String,
        required: true
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true 
    },
    bookingStatus: {
        type: String,
        enum: ["booked", "canceled", "completed"],
        default: "booked"
    }
}, {
    timestamps: true
});

// Adding an index to optimize lookups
bookingSchema.index({ user: 1, business: 1, date:1 });

const bookingModel = mongoose.model('Booking', bookingSchema)

export default bookingModel
