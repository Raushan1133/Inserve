import mongoose from "mongoose";
import bookingModel from "../models/BookingModel.js";
import userModel from "../models/UserModel.js";

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

const cancelBooking = async(req,res)=>{
    try {
        console.log(req.body)
        if(req.body.businessId){
            const response = await bookingModel.deleteOne({date:req.body.date,business : req.body.businessId, time:req.body.time});
        }else{
            const response = await bookingModel.deleteOne({date:req.body.date, user : req.body.userId, time:req.body.time});
        }
        res.status(200).json({message : "Service Cancelled Success !",success:true,error:false});
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Something went wrong !",success:false,error:true});
    }
}

const updateBooking = async(req,res)=>{

}

export  {addBooking,getBookedSlot,getBookings,cancelBooking,updateBooking}