const jwt = require("jsonwebtoken");

module.exports = function(req,res,next) {
    const token = req.headers.authorization.split(" ")[1];
    if(!token) {
        return res.status(401).send({message: 'Token is not provided'});
    }
    try{
        const user = jwt.verify(token, process.env.JWTSECRET);
            req.user = user;
            next();
        } catch(err) {
            return res.status(403).send({message: 'Token is invalid'});
        }    
    }    
