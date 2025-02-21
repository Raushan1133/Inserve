import cartModel from "../models/cartModel.js";

const addToCart = async(req,res)=>{
    try {
        const userId = req.user.userId;
        console.log(req.body)
        const {productId,productOwner} = req.body;
        const isProductExists = await cartModel.findOne({userId : userId,productId:productId,productOwner : productOwner});
        if(isProductExists){
            return res.status(400).json({message : "Item already exists in cart !",success : false});
        }

        const data = await cartModel.create({
            userId,
            productId,
            productOwner
        })

        return res.status(201).json({message : "Item Added To Cart",success : true,data});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Server is down !",success : false});
    }
}

const getCart = async(req,res) =>{
    try {
        const id = req.user.userId;
        const data = await cartModel.find({userId:id}).populate('productId').populate('productOwner');
        return res.status(200).json({message : "Cart fetched success !",success : true,data});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Server is down !",success : false});
    }
}

const deleteCartItems = async(req,res)=>{
    try {
        const userId = req.user.userId;
        const {productId} = req.body;

        const response = await cartModel.deleteOne({userId,productId});
        console.log(res);
        return res.status(200).json({message : "Item removed from cart !",success:true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Server is down !",success : false});
    }
}

const increaseQty = async(req,res)=>{
    try {
        const {cartItemId} = req.body;
        const data = await cartModel.findById(cartItemId);
        const response = await cartModel.findByIdAndUpdate(cartItemId,{
            $set : {quantity : data.quantity + 1}
        });
        console.log(response);
        return res.status(200).json({message:'Ok',success : true});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Server is down !",success : false});
    }
}

const decreaseQty = async(req,res)=>{
    try {
        const {cartItemId} = req.body;
        const data = await cartModel.findById(cartItemId);
        const response = await cartModel.findByIdAndUpdate(cartItemId,{
            $set : {quantity : data.quantity - 1}
        });
        console.log(response);
        return res.status(200).json({message:'Ok',success : true});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Server is down !",success : false});
    }
}

export {addToCart,getCart,deleteCartItems,increaseQty,decreaseQty}