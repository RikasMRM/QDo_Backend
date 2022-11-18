import User from "../model/userModel.js";
import { generateToken } from "../utils/handleJwtToken.js";

// @desc Register new user
// @route Post /api/users/register
// @access Public
const registerUser = async (req, res) => {
  if (req.body) {
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
  } else {
    res.status(200).send({ success: false, message: "Error" });
  }
};

// @desc User Login
// @route Post /api/users/login
// @access Public
const loginUser = async (req, res) => {
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
};

const getUserProfileData = async (req, res) => {
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
};

export default {
  registerUser,
  loginUser,
  getUserProfileData,
};
