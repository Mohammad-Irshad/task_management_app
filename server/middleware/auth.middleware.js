const jwt = require('jsonwebtoken')

const verifyJWT = async (req, res, next) => {

    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: "Unauthorized request" });
    }

    try{               
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);  
        req.user = decodedToken
        next() 
    }catch(error){
        return res.status(402).json({message : "Invalid token."})
    }
}

module.exports = verifyJWT;