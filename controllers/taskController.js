import asyncHandler from "express-async-handler";
import Task from "../model/taskModel.js";

// @desc Add new task
// @route Post /api/tasks/
// @access Auth User
const createNewTask = asyncHandler(async (req, res) => {
  try {
    const { name, description, filePath, fileName, user } = req.body;

    //save to database
    const document = await Task.create({
      name,
      description,
      user,
      filePath,
      fileName,
    });
    if (document) {
      res.status(201).send({
        success: true,
        message: "task saved successfully!",
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Error! Can't save task.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      message: "Error!",
    });
  }
});

export default {
  createNewTask,
};
