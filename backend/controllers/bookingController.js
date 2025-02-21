import bookingModel from "../models/BookingModel.js";
import userModel from "../models/UserModel.js";
import { transporter } from "../configs/transporter.js";
import otpModel from "../models/otpModel.js";

const addBooking = async(req,res)=>{
    try {
        const {userId,date,time,businessId} = req.body;
        const response = await bookingModel.create({
            user:userId,
            time:time,
            date : date,
            business : businessId
        })
        return res.status(200).json({"message" : "Service Booked Successfully.",success:true,data : response});
    } catch (error) {
        return res.status(500).json({message : `Something went wrong ! ${error.message} `,success:false})
    }
}

const getBookedSlot = async(req,res)=>{
    try {
        const {businessId,date} = req.body;
        const bookedSlot = await bookingModel.find({business:businessId,date:date});
        return res.status(200).json({success:true,data : bookedSlot});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : `Something went wrong ! ${error.message}`,success:false})
    }
}

const getBookings = async(req,res)=>{
    try {
        const user = await userModel.findById(req.user.userId);
        let bookings;
        if(user){
             bookings = await bookingModel.find({user : req.user.userId}).populate('business').select("-password").sort({createdAt:-1});
        }else{
             bookings = await bookingModel.find({business : req.user.userId}).populate('user').sort({createdAt:-1}).select("-password");
        }
       return res.status(200).json({message : "Success",success:true,data:bookings});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Somthing went wrong !",success:false});  
    }
}

const cancelBookingByUser = async(req,res)=>{
    try {

        console.log(req.body)
        const {userId,businessId,date,time} = req.body;
        console.log(req.body);
        const response = await bookingModel.updateOne({date:date, user : userId, time:time,business:businessId},{$set : {bookingStatus : 'cancelled'}});
        return res.status(200).json({message:"Booking Cancelled Success !",success:true,error:false});
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal Server Error !",success:false,error:true});
    }
}

const sendMailForUpdateBooking = async(req,res)=>{
    try {
        const {userId,email} = req.body;
        console.log(req.body)
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP       
            let info = await transporter.sendMail({
                from : process.env.EMAIL_FROM,
                to : email,
                subject : "Raushan's Inserve project - Booking Cancellation Request From Service Provider !",
                html: `
                <p>Hello,</p>
                <p>Your OTP for Booking Cancellation is: <strong>${otp}</strong></p>
                <p>This OTP is valid for the next 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                <br />
                <p>Thank you,</p>
                <p>InServe Team</p>
              `,
            })
            await otpModel.create({
                userId : userId,
                otp : otp
            })
        res.status(200).json({message : "Otp sent to user successfully !",success:true,error:false});
    } catch (error) {
        res.status(500).json({message : "Internal Server error !",success:false,error:true});
    }
}

const cancelBookingByProvider = async(req,res)=>{
    try {
        const {userId,otp,businessId,time,date} = req.body;
        console.log(req.body);
        console.log(otp)
        if(!otp){
            return res.status(401).json({message:"Please enter otp !",success:false})
        }
        const isValidOtp = await otpModel.findOne({userId,otp});
        console.log("User otp",isValidOtp)
        if(isValidOtp){
            const response = await bookingModel.updateOne({date:date, user : userId, time:time,business:businessId,bookingStatus:"booked"},{$set : {bookingStatus : 'cancelled'}});
            console.log("Deleted or not ! : ",response);
            await otpModel.deleteOne({otp:otp})
        }else{
            return res.status(401).json({message:"Invalid Otp",success:false})
        }
         return res.status(200).json({message:"Booking Cancelled Success !",success:true,error:false});
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal server error !",success:false,error:true});
    }
}

const updateBooking = async(req,res)=>{
    try {
        const {userId,otp,businessId,time,date} = req.body;
        console.log(otp)
        if(!otp){
            return res.status(401).json({message:"Please enter otp !",success:false})
        }
        const isValidOtp = await otpModel.findOne({userId,otp});
        console.log("User otp",isValidOtp)
        if(isValidOtp){

            const response = await bookingModel.updateOne({date:date, user : userId, time:time,business:businessId,bookingStatus:"booked"},{$set : {bookingStatus : 'completed'}});
            await otpModel.deleteOne({otp:otp})
        }else{
            return res.status(401).json({message:"Invalid Otp",success:false})
        }
         return res.status(200).json({message:"Booking Updated Success !",success:true,error:false});
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Internal server error !",success:false,error:true});
    }
}

export  {addBooking,getBookedSlot,getBookings,cancelBookingByUser,updateBooking,sendMailForUpdateBooking,cancelBookingByProvider}