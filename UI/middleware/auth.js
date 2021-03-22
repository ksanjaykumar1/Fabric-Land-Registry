const jwt = require('jsonwebtoken')
const config = require('config');

module.exports = function(req, res, next) {
    // get the token form header 
    const token = req.header('x-auth-token');
    //check if no token
    if(!token){
        return res.status(401).json({msg : "no token , authorization denied"})
    }
    //verify token
    
    try{

        const decoded = jwt.verify(token, config.get('jwtSecret'));
        //we could use this req.user into further routes
        req.user = decoded.user;
        next();

    }
    catch(err){
        return res.status(401).json({msg : "token is not valid "})
    }

}