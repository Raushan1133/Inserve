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
        console.log(error)
       return res.status(500).json({message : "something went wrong !",success:false,error:error})
    }
}

const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        console.log(email)
        let user = await userModel.findOne({email});
        if(!user){
            user = await businessModel.findOne({email});
        }
        console.log("USer ",user)
        if(!user){
            return res.status(404).json({message:"Incorrect Email Or Password !"});

        }
        const isMatch =await bcrypt.compareSync(password,user.password);
        console.log("Ismatch : ",isMatch)
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
        res.clearCookie("token", { path: "/", httpOnly: true, secure: true });
        res.status(200).json({message:"Logout success !",success:true});
    } catch (error) {
        res.status(500).json({message:"Somthing Went Wrong !"});
    }
}

export {getUserDetails,login,logout}