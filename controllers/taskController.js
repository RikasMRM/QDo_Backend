import asyncHandler from "express-async-handler";
import Task from "../model/taskModel.js";
import User from "../model/userModel.js";
import mongoose from "mongoose";
import fs from "fs";
import { decodeJWTToken } from "../utils/handleJwtToken.js";

const ObjectId = mongoose.Types.ObjectId;

// @desc Add new task
// @route Post /api/tasks/
// @access Auth User
const createNewTask = asyncHandler(async (req, res) => {
  try {
    const { name, description, filePath, fileName } = req.body;
    const user = req.user._id;

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

// @desc Get user tasks filtered
// @route Get /api/tasks/filter
// @access Auth User
const filterTasksData = asyncHandler(async (req, res) => {
  try {
    const userID = req.user._id;
    const { status, endDate, startDate } = req.body;

    let query = { user: ObjectId(userID) };

    if (status && startDate) {
      query.status = status;
      let q2 = {
        createdAt: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
      };
      query.createdAt = q2.createdAt;
    } else {
      if (startDate && endDate) {
        let q2 = {
          createdAt: {
            $gte: new Date(startDate),
            $lt: new Date(endDate),
          },
        };
        query.createdAt = q2.createdAt;
      } else {
        query.status = status;
      }
    }

    const tasks = await Task.find(query);
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
    const tasks = await Task.find({
      user: ObjectId(userID),
      _id: ObjectId(taskID),
    });

    if (tasks.length > 0) {
      const query = { _id: taskID };
      let update_data = {
        status: req.body.status == null ? tasks[0].status : req.body.status,
        name: req.body.name == null ? tasks[0].name : req.body.name,
        description:
          req.body.description == null
            ? tasks[0].description
            : req.body.description,
      };

      await Task.updateOne(query, update_data).then((result) => {
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

// @desc Delete user tasks
// @route Delete /api/tasks/:id
// @access Auth User
const deleteTask = asyncHandler(async (req, res) => {
  try {
    const userID = req.user._id;
    const taskID = req.params.id;

    //get user's task by id
    const task = await Task.find({
      user: ObjectId(userID),
      _id: ObjectId(taskID),
    });

    //if task is user's task
    if (task.length > 0) {
      const query = { _id: taskID };
      await Task.deleteOne(query).then((data) => {
        res
          .status(200)
          .send({ success: true, message: "Task Deleted Successfully!" });
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

// @desc View user tasks
// @route Get /api/tasks/:id
// @access Auth User
const viewSingleTask = asyncHandler(async (req, res) => {
  try {
    const userID = req.user._id;
    const taskID = req.params.id;

    //get user's task by id
    const task = await Task.find({
      user: ObjectId(userID),
      _id: ObjectId(taskID),
    });

    //if task is user's task
    if (task) {
      res.json(task);
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

// @desc Download/View task attachment
// @route Get /api/tasks/download/:id/:token
// @access Auth User
const downloadAttachment = asyncHandler(async (req, res) => {
  try {
    let taskID = req.params.id;

    // Validate user token
    let userToken = req.params.token;
    const tokenDecrypt = decodeJWTToken(userToken);

    if (tokenDecrypt) {
      const user = await User.findById(tokenDecrypt.id).select("-password");

      if (user) {
        const taskResponse = await Task.findById(taskID);
        if (taskResponse) {
          try {
            const fileName = taskResponse.fileName;
            const fileURL = "./" + taskResponse.filePath;
            const stream = fs.createReadStream(fileURL);
            res.set({
              "Content-Disposition": `attachment; filename=${fileName}`,
            });
            stream.pipe(res);
          } catch (e) {
            console.error(e);
            res.status(200).send({
              success: false,
              message: "Error! Can't download attachment.",
            });
          }
        } else {
          res.status(200).send({
            success: false,
            message: "Error! Can't download attachment.",
          });
        }
      } else {
        res.status(401).send({
          success: false,
          message: "Error! No user found!",
        });
      }
    } else {
      res.status(401).send({
        success: false,
        message: "Error! Unauthorized!",
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
  deleteTask,
  viewSingleTask,
  downloadAttachment,
  filterTasksData,
};
