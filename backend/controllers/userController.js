import businessModel from "../models/businessModel.js";
import userModel from "../models/UserModel.js";
import jwt from 'jsonwebtoken'

const register = async(req,res)=>{
try {
  const {name,email,password,profile_pic} = req.body;

  if(!name || !email || !password  ){
      return res.status(400).json({"message":"All Fields Are Required !","success":"false"});
  }
  
  const isMatch = await userModel.findOne({email});
  console.log(isMatch);
  if(isMatch){
    return res.status(400).json({message:"Account Already Exists !",success:false});
  }
  const doc = await userModel.create({
    name,
    email,
    password,
    profile_pic
  })
  const data = await userModel.findOne({email}).select("-password");
  const payload = {
    userId : data._id,
    email : data.email
  }
  const cookieOption = {
    httpOnly:true,
    secure:true,
    sameSite : 'None',
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
  const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn :'30d'});
  return res.cookie("token",token, cookieOption).status(200).json({"message":"registerd success","success":true, data:data});
} catch (error) {
  console.log(error);
  return res.status(400).json({message:"Something Went Wrong !",success:false});
}
    
}


const findNearbyBusinesses = async (req,res) => {
    const userLocation = [77.5946, 12.9716]; // Example user location (Bangalore, India)
    try {
      const nearbyBusinesses = await businessModel.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: userLocation,
            },
            $maxDistance: 5000, // 5 kilometers
          },
        },
      });
      console.log("Nearby Businesses:", nearbyBusinesses);
      return res.status(200).json({"message":"all nearby business","data":nearbyBusinesses})
    } catch (error) {
        res.status(400).json(error)
      console.error("Error finding nearby businesses:", error);
    }
  };

  const getUserById = async(req,res)=>{
    try {
      const {id} = req.body;
      const data = await userModel.findById(id)
      return res.status(200).json({"message":"success","success":true,data:data});

    } catch (error) {
      console.log(error)
      return res.status(400).json({message:"Server is down !",success:false});
    }
  }
  
  

export  {register, findNearbyBusinesses,getUserById}