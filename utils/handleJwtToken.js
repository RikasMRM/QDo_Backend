import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10min",
  });
};

export const decodeJWTToken = (receivedToken) => {
  try {
    const decodedToken = jwt.verify(receivedToken, process.env.JWT_SECRET);
    return decodedToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};
