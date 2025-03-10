import stripe from '../../configs/stripe.js';
import userModel from '../../models/UserModel.js';
const paymentController =async (req,res) => {
    try {
        const {cartItems} = req.body;
        console.log(req.user)
        const user = await userModel.findOne({_id:req.user.userId});
        console.log(user)
        const params = {
            submit_type : 'pay',
            mode:'payment',
            payment_method_types:['card'],
            billing_address_collection :'auto',
            shipping_options: [
                {
                    shipping_rate:'shr_1QvGHeC41AYdqM6tvqHi8Ffv'
                }
            ],
            customer_email:user.email,
            metadata:{
                userId : req.user.userId
            },
            line_items:cartItems.map((item,index)=>{
                return{
                    price_data : {
                        currency : 'inr',
                        product_data : {
                            name: item.productId.productName,
                            images : item.productId.productImages,
                            metadata : {
                                productId : item.productId._id
                            },
                            // productOwner : item.productOwner
                        },
                        unit_amount : item.productId.productSellingPrice*100
                    },
                    adjustable_quantity:{
                        enabled:true,
                        minimum : 1
                    },
                    quantity: item.quantity
                }
            }),

            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel` 
        }
        const session = await  stripe.checkout.sessions.create(params);
        res.status(303).json(session)
    } catch (error) {
        res.json({
            message:error?.message || error,
            error:true,
            success:false
        })
    }
}

export default  paymentController