const professorMiddleware =
(req,res,next)=>{

if(req.user.role !== 'professor'){

return res.status(403).json({
message:'Only Professors Allowed',
});

}

next();

};

module.exports =
professorMiddleware;