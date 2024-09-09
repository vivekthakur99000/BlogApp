import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  // check if headers contains token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("bearer")
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];
      // verify token

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // FIND USER BY DECODED TOKEN ID

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if(!token){
    res.status(401).json({message : "Not authorized, no token"});
  }
};

export {protect}
