const jwt = require("jsonwebtoken");

module.exports = function(req,res,next) {
    const token = req.header.authorization;
    if(!token) {
        return res.status(401).json({message: 'Token is not provided'});
    }
    try{
        const user = jwt.verify(token, process.env.JWTSECRET);
            req.user = user;
            next();
        } catch(err) {
            return res.status(403).json({message: 'Token is invalid'});
        }    
    }    
