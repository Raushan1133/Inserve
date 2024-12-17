import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'

const businessSchema = mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    profile_pic: {
      type: String,
    },
    personName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true,
    },
    password: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "provider",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    gallery: {
      type: [String],
    },
    businessStartTime:{
      type:String,
      required:true
    },
    businessClosingTime:{
      type:String,
      required:true
    },
    serviceGap : {
      type:String,
      required:true
    },
  },
  {
    timestamps:true
  }
);

businessSchema.pre("save",async function(next){
  if(this.isModified("password")){
    const salt = bcryptjs.genSaltSync(10);
    this.password = bcryptjs.hashSync(this.password, salt);
  }
  next();
})

const businessModel = mongoose.model("Business", businessSchema);

export default businessModel;
