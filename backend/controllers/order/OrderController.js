import orderModel from "../../models/orderModel.js";

const getOrders = async(req,res)=>{
    try {
        const userId = req.user.userId;
        const data = await orderModel.find({userId})
        return res.status(200).json({message:'ok',success:true,data});
    } catch (error) {
        return res.status(500).json({message : "Server is down !",success:false})
    }
}

const getOrdersForProvider = async(req,res)=>{
    try {
        const providerId = req.user.userId;
        const orders = await orderModel.find();
        const providerData = orders.productDetails.foreach((products,i)=>{
            products.filter((product,id)=>{})
        })
    } catch (error) {
        
    }
}

const cancelOrder = async(req,res)=>{
    try {
        const userId = req.user.userId;
        const{productId} = req.body
        const data = await orderModel.findOneAndDelete({userId})
        return res.status(200).json({message:'ok',success:true,data});
    } catch (error) {
        return res.status(500).json({message : "Server is down !",success:false})
    }
}

export  {getOrders,cancelOrder}