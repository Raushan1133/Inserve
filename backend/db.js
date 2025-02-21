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
                const collections = await mongoose.connection.db.listCollections().toArray();
                const collectionNames = collections.map(col => col.name);
        
                if (!collectionNames.includes("businesses")) {
                    throw new Error("❌ 'businesses' collection does not exist yet. Ensure data is inserted first.");
                }
        
                await businessModel.collection.createIndex({ location: "2dsphere" });
                console.log("✅ 2dsphere index created successfully.");
            } catch (error) {
                console.log("error occured",error)
            }
        }

        export default connectDB