const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next)=>{

const header =
req.headers.authorization;

if(!header){

return res.status(401).json({
message:'No Token Provided',
});

}

const token =
header.startsWith('Bearer ')
? header.slice(7)
: header;

try{

req.user =
jwt.verify(
token,
process.env.JWT_SECRET
);

next();

}catch{

return res.status(401).json({
message:'Invalid Token',
});

}

};

module.exports =
authMiddleware;