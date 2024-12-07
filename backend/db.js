import mongoose from "mongoose";
import businessModel from "./models/businessModel.js";

const connectDB = async()=>{
    const MONGODB_URL = process.env.mongoDB_URL;
    try {
        await mongoose.connect(MONGODB_URL);
        const connection = mongoose.connection;
        if(connection){
            console.log("connected")
        }
        await businessModel.collection.createIndex({ location: "2dsphere" });
        console.log("2dsphere index created successfully.");
    } catch (error) {
        console.log("error occured",error)
    }
}

export default connectDB