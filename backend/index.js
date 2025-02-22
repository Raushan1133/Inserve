import express from 'express'
const app = express();

import connectDB from './db.js';
import { configDotenv } from 'dotenv';
import userRouter from './routes/userRoutes.js';
import businessRouter from './routes/businessRoutes.js'
import categoryRouter from './routes/categoryRoutes.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import commonRouter from './routes/commonRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/Order.js';
configDotenv();
connectDB();
app.use(express.json())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
}))
app.use(cookieParser())


app.use("/api/user",userRouter);
app.use("/api/business",businessRouter);
app.use("/api/categories",categoryRouter);
app.use("/api/common",commonRouter);
app.use("/api/booking",bookingRouter);
app.use("/api/product",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    try {
        res.status(200).json("Hello inserve !");
    } catch (error) {
        res.status(400).json("something went wrong !");
    }
})
app.listen(8000,()=>console.log("server is running on 8000 "));