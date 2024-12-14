import jwt from 'jsonwebtoken'
const authMiddleware = async(req,res,next)=>{
    try {
        const token = req?.cookies?.token
    if(!token){
        return res.status(404).json({"message":"Please Login First",success:false});
    }

    jwt.verify(token,process.env.JWT_SECRET_KEY,(error,decoded)=>{
        if(error){
            return res.status(400).json({"message":"token expired, Login again",success:false});
        }
        req.user = decoded;
    });

    next();
    } catch (error) {
        console.log(error)
        res.status(400).json({message : "something went wrong !",success:false,error:error})
    }
}

export default authMiddleware