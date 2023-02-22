import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.JWT_SECRET;

const verifyToken = asyncHandler(async (req, res, next) => {
  // console.log(req.headers);
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
    jwt.verify(token, secretKey, (error, decoded) => {
      // console.log(error);
      if (error) return res.status(401).send({ message: "Unauthorized!!" });
      // console.log(decoded);
      req.user = decoded;
      next();
    });
  } else {
    res
      .status(401)
      .send({ message: "Unauthorized-No authorization header found" });
  }
});

export { verifyToken };
