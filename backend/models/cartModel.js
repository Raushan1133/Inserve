import mongoose from "mongoose";

const cartSchema =mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    productOwner : {
        type : mongoose.Schema.ObjectId,
        ref : 'Business',
        required : true
    },
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : 'product',
        required : true
    },
    quantity : {
        type : Number,
        default : 1
    }
})

const cartModel = mongoose.model("Cart",cartSchema);

export default cartModel