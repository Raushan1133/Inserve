import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const userSchema = mongoose.Schema({
   name: {
    type : String,
    required : true
    },
    email:{
        type : String,
        required : true
    },
    password:{
        type : String,
    },
    picture:{
        type:String
    },
    type:{
      type:String,
      enum:["seeker","provider"],
      default:"seeker"
    },
    bookings:[
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
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
}
)

userSchema.pre('save',async function(next){
  if(this.isModified("password")){
    const salt = bcryptjs.genSaltSync(10);
    this.password = bcryptjs.hashSync(this.password, salt);
  }
  next();
})
const userModel = mongoose.model("User",userSchema);
export default userModel;