import mongoose from "mongoose";

const businessSchema = mongoose.Schema({
  businessName: {
    type: String,
    require: true,
  },
  category : {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category"
  },
  profile : {
    type:String,
  },
  personName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type:String,
  },
  about: {
    type: String,
    require: true,
  },
  type:{
    type:String,
    default:"provider"
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

  gallery:{
    type:[]
  },
  bookings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      bookedAt: {
        type: String,
        required: true,
      },
      bookingStatus:  {
        type:String,
        enum:["booked","cancelled","completed"],
        default : "booked"
      }
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const businessModel = mongoose.model("Business", businessSchema);

export default businessModel;
