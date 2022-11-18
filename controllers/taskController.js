import asyncHandler from "express-async-handler";
import Task from "../model/taskModel.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

// @desc Add new task
// @route Post /api/tasks/
// @access Auth User
const createNewTask = asyncHandler(async (req, res) => {
  try {
    const { name, description, filePath, fileName, user } = req.body;

    //save to database
    const task = await Task.create({
      name,
      description,
      user,
      filePath,
      fileName,
    });
    if (task) {
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

// @desc Get user tasks
// @route Get /api/tasks/
// @access Auth User
const getTasksByUser = asyncHandler(async (req, res) => {
  try {
    const userID = req.user._id;
    const tasks = await Task.find({
      user: ObjectId(userID),
    });
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      message: "Error!",
    });
  }
});

// @desc Update user tasks
// @route Put /api/tasks/:id
// @access Auth User
const updateTaskStatus = asyncHandler(async (req, res) => {
  try {
    const userID = req.user._id;
    const taskID = req.params.id;

    //get user's task by id
    const task = await Task.find({
      user: ObjectId(userID),
      _id: ObjectId(taskID),
    });

    if (task) {
      const query = { _id: taskID };
      const update = {
        status: req.body.status,
      };

      await Task.updateOne(query, update).then((result) => {
        res.status(200).send({
          success: true,
          message: "Task Status Updated Successfully!",
        });
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Task not found",
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
  getTasksByUser,
  updateTaskStatus,
};
