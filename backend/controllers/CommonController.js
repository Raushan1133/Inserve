import userModel from "../models/UserModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import businessModel from "../models/businessModel.js";

const getUserDetails = async(req,res)=>{
    try {
        const {userId} = req.user;
        let user = await userModel.findById(userId).select("-password ");
        if(!user){
            user = await businessModel.findById(userId).select("-password ");
        }
        res.status(200).json({message:"data fetched success",success:true,data:user});
    } catch (error) {
       return res.status(500).json({message : "something went wrong !",success:false,error:error})
    }
}

const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        let user = await userModel.findOne({email});
        if(!user){
            user = await businessModel.findOne({email});
        }
        if(!user){
            return res.status(404).json({message:"Incorrect Email Or Password !"});

        }
        const isMatch =await bcrypt.compareSync(password,user.password);
        if(!isMatch){
            return res.status(404).json({message:"Incorrect Email Or Password !"});
        }
        const payload = {
            userId : user?._id,
            email : user?.email
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:'30d'});
        const cookieOption = {
            httpOnly:true,
            secure:true,
            sameSite : 'None',
            maxAge: 30 * 24 * 60 * 60 * 1000
          }
          let data = await userModel.findOne({email :user?.email}).select("-password")
          if(!data){
            data = await businessModel.findOne({email}).select("-password");
          }

        return res.cookie("token",token,cookieOption).status(200).json({message : "Login Success !",success:true,data : data});
    } catch (error) {
        return res.status(500).json({message : "Something went wrong !",success:false});
    }
}

const logout = async(req,res)=>{
    try {
        res.clearCookie("token", { path: "/", httpOnly: true, secure: true, sameSite : 'None' });
        res.status(200).json({message:"Logout success !",success:true});
    } catch (error) {
        res.status(500).json({message:"Somthing Went Wrong !"});
    }
}

const updateDetails = async (req, res) => {
    try {
      const { name, email, profile_pic } = req.body;
  
      // Check if user exists in userModel
      let user = await userModel.findOne({ email });
      let updatedUser;
  
      if (user) {
        // Update user in userModel
        updatedUser = await userModel.findOneAndUpdate(
          { email },
          { $set: { name, profile_pic } },
          { new: true } // Return the updated document
        );
      } else {
        // Check if user exists in businessModel
        user = await businessModel.findOne({ email });
        if (!user) {
          return res
            .status(404)
            .json({ message: "User Not Found!", success: false });
        }
  
        // Update user in businessModel
        updatedUser = await businessModel.findOneAndUpdate(
          { email },
          { $set: { personName: name, profile_pic } },
          { new: true } // Return the updated document
        );
      }
  
      return res
        .status(200)
        .json({ message: "Profile Updated Successfully!", success: true, data: updatedUser });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong!", success: false, error });
    }
  };
  

const changePassword = async(req,res)=>{
    try {
        const {email,curr_password,new_password} = req.body;
        let user = await userModel.findOne({email});
        let updatedUser;
        if(!user){
          user = await businessModel.findOne({email});
          if(user){
            const isMatch = await bcrypt.compareSync(curr_password,user.password);
            if(!isMatch){
              return res.status(400).json({message : "Old Password Not Matched",success:false})
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hashSync(new_password,salt);
            updatedUser = await businessModel.findOneAndUpdate({email},{$set : {password : hashedPassword}},{new:true})
          }else{
            return res.status(404).json({message:"User not found !",success:false});
          }
        }else{
          const isMatch = await bcrypt.compareSync(curr_password,user.password);
          if(!isMatch){
            return res.status(400).json({message : "Old Password Not Matched",success:false})
          }
          
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hashSync(new_password,salt);
          updatedUser = await userModel.findOneAndUpdate({email},{$set : {password : hashedPassword}},{new:true})
        }
        return res.status(200).json({message:"Password Updated Successfully !",success:true});
    } catch (error) {
      console.log(error)
        return res.status(500).json({message:"Somthing went wrong !",success:false,error:error.message});
    }
}

export {getUserDetails,login,logout,updateDetails,changePassword}