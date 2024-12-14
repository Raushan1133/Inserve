import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const userSchema = mongoose.Schema({
   name: {
    type : String,
    required : true
    },
    email:{
        type : String,
        required : true,
        match: [/\S+@\S+\.\S+/, "Invalid email address"]
    },
    password:{
        type : String,
        required:true
    },
    profile_pic:{
        type:String
    },
    type:{
      type:String,
      enum:["seeker","provider"],
      default:"seeker"
    },
},{
  timestamps:true
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