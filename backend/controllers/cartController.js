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

export {addToCart}