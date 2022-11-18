import User from "../model/userModel.js";

// @desc Register new user
// @route Post /api/users/
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

export default {
  registerUser,
};
