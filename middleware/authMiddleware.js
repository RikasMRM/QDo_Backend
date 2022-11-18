import asyncHandler from "express-async-handler";
import User from "../model/userModel.js";
import { decodeJWTToken } from "../utils/handleJwtToken.js";

const protect = asyncHandler(async (req, res, next) => {
  let receivedToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      receivedToken = req.headers.authorization.split(" ")[1];
      const decodedToken = decodeJWTToken(receivedToken);
      req.user = await User.findById(decodedToken.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      console.log("Token is broken , cannot be Authorized!");
      throw new Error("Token is broken , cannot be Authorized!");
    }
  }

  if (!receivedToken) {
    res.status(401);
    console.log("Not a valid user!");
    throw new Error("Not a valid user!");
  }
});

export { protect };