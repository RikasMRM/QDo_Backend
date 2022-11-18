import User from "../model/userModel.js";
import asyncHandler from "express-async-handler";
import { generateToken, decodeJWTToken } from "../utils/handleJwtToken.js";

// @desc Register new user
// @route Post /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  if (req.body) {
    const { email } = req.body;
    const chk_user_existence = await User.findOne({ email: email });

    if (chk_user_existence) {
      res.status(200).send({
        success: false,
        message: `There's a user already registered with that mail`,
      });
    } else {
      const user = new User(req.body);
      await user
        .save()
        .then((data) => {
          res.status(201).send({
            success: true,
            message: "User Registered Successfully!",
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(200).send({ success: false, message: error.message });
        });
    }
  } else {
    res.status(200).send({ success: false, message: "Error" });
  }
});

// @desc User Login
// @route Post /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  if (req.body) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      if (email && password) {
        //get user data
        var userData = await User.findOne({ email: email });

        if (userData != null) {
          if (userData && (await userData.matchPassword(password))) {
            res.json({
              _id: userData._id,
              name: userData.name,
              email: userData.email,
              token: generateToken(userData._id),
            });
          } else {
            res.status(200).send({
              success: false,
              message: "Invalid Credentials!",
            });
          }
        } else {
          res.status(200).send({
            success: false,
            message: "User Not Found!",
          });
        }
      } else {
        res
          .status(200)
          .send({ success: false, message: "Email or Password not found!" });
      }
    } catch (e) {
      console.log(e);
      res.status(200).send({ success: false, message: "Exceptional Error" });
    }
  } else {
    res.status(200).send({ success: false, message: "Error" });
  }
});

// @desc User Profile Data
// @route Post /api/users/:id
// @access Auth User
const getUserProfileData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(200).send({ success: false, message: "User not found!" });
    throw new Error("User cannot be found");
  }
});

// @desc User Validate Token
// @route Post /api/users/token/:tokenID
// @access Public
const validateUserToken = asyncHandler(async (req, res) => {
  const userToken = req.params.tokenID;
  const tokenResult = decodeJWTToken(userToken);

  if (tokenResult) {
    const user = await User.findById(tokenResult.id);
    if (user) {
      res.status(200).send({
        success: true,
        message: "Not Expired!",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(401).send({ success: false, message: "Unauthorized!" });
    }
  } else {
    res.status(401).send({ success: false, message: "Unauthorized!" });
  }
});

export default {
  registerUser,
  loginUser,
  getUserProfileData,
  validateUserToken,
};
