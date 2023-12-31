const jwt = require("jsonwebtoken");
require("dotenv").config();


const verifyToken = (req, res, next) => {
  
  try {

      const token = req.body.token || req.query.token || req.headers["x-access-key"];

      if(!token) {
        res.status(403).send("A token is required for authentication");
      } else {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded
      }
    } catch (error) {
      console.log("🚀 ~ file: auth.js:14 ~ verifyToken ~ error:", error)
      res.send("Invalid Token");
    }
    return next();

}

module.exports = verifyToken;