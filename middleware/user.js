const jwt=require("jsonwebtoken")

const {JWT_SECRET} =require("../config")

function userMiddleware(req, res, next) {
  
    const token=req.headers.authorization;
    const words=token.split(" ");
    jwtToken=words[1];
    const decodedvalue=jwt.verify(jwtToken,JWT_SECRET);
    if(decodedvalue.username){
        req.username=decodedvalue.username
        next();
    }
    else{
        res.status(403).json({
            msg:"You are not Authorized user"
        })
    }
}

module.exports = userMiddleware;