import jwt from 'jsonwebtoken'
const authMiddleware = async(req,res,next)=>{
    const token = req.headers.authorization

    if(!token){
        return res.status(404).json({"message":"Please Login First"});
    }

    jwt.verify(token,process.env.JWT_SECRET_KEY,(error,decoded)=>{
        if(error){
            return res.status(400).json({"message":"token expired, Login again"});
        }
        req.user = decoded;
    });

    next();
}