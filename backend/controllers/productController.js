import productModel from "../models/productModel.js";

const addProduct = async(req,res)=>{
    try {
        const {productName,productCostPrice,productSellingPrice,productImages,productCategory,productDescription} = req.body;
        const productOwner = req.user.userId;

        const data = await productModel.create({
            productOwner : productOwner,
            productName,
            productCostPrice,
            productSellingPrice,
            productImages,
            productCategory,
            productDescription,
        });

        return res.status(200).json({message:"Product added success !",success:true,error:false,data});

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server is down !",success:false,error:true});
    }
}

const getProduct = async(req,res)=>{
    try {
        const id = req.user.userId;
        const data = await productModel.find({productOwner : id});
        return res.status(200).json({message:"Product fetched success !",success:true,error:false,data});
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server is down !",success:false,error:true});
    }
}

export  {addProduct,getProduct}