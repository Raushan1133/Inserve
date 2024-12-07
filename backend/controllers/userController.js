import businessModel from "../models/businessModel.js";
import userModel from "../models/UserModel.js";

const register = async(req,res)=>{
    const {name,email,password,picture,type} = req.body;

    if(!name || !email || !password || !type ){
        return res.status(400).json({"message":"All Fields Are Required !","success":"false"});
    }

    const result =await new userModel({name,email,password,picture,type}).save();
    const doc = await userModel.findOne({email}).select("-password");
    return res.cookie("token","tokenxxxx", { expires: new Date(Date.now() + 900000), httpOnly: true }).status(201).json({"message":"registerd success","success":"true", "data":doc});
    
}

const login = async()=>{
    const{email,password} = req.body;
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
  
  

export  {register,login, findNearbyBusinesses}