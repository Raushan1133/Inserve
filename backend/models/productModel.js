import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
    productOwner : {
        type : mongoose.Schema.ObjectId,
        ref :"Business"
    },
    productName : {
        type : String,
        required:true
    },
    productCostPrice:{

    },
    productSellingPrice:{

    },
    productImages:{
        type :[]
    },
    productCategory : {
        type : String,
        required:true
    },
    productDescription : {
        type : String,
        required:true
    }
})

const productModel = mongoose.model('product',productSchema);

export default productModel;