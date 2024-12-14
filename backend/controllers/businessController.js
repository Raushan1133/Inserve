import businessModel from "../models/businessModel.js";
import categoryModel from "../models/CategoryModel.js";
import jwt from 'jsonwebtoken'

const addBusiness = async (req,res) => {
  try {
      
    console.log(req.body);
    const {businessName,category,profile_pic,personName,email,password,description,location,gallery,businessStartTime,businessClosingTime,serviceGap} = req.body;
    
    if(!businessName || !category || !personName || !email || !password || !description || !location || !businessStartTime || !businessClosingTime || !serviceGap){
      return res.status(400).json({message:"All Fields Are Requires !",success:false});
    }
    const isMatch = await businessModel.findOne({email});
    console.log(isMatch)
    if(isMatch){
      return res.status(400).json({message:"Account Already Exists !",success:false});
    }

    const data = await businessModel.create({
      businessName,
      category,
      personName,
      profile_pic,
      email,
      password,
      description,
      location:{
        type:"Point",
        coordinates:[location.latitude,location.longitude]
      },
      businessStartTime,
      businessClosingTime,
      serviceGap
    })
    const payload = {
      userId : data._id,
      email : data.email
    }
        const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'30d'});
        const cookieOption = {
            httpOnly:true,
            secure:true,
            sameSite : 'None',
            maxAge: 30 * 24 * 60 * 60 * 1000
          }
    return res.cookie("token",token,cookieOption).status(201).json({"message":"business created success",success:true,data:data});
  } catch (error) {
    console.error("Error adding business:", error);
    return res.status(500).json({message:"Something Went Wrong !",data:error})
  }
};


export {addBusiness}

