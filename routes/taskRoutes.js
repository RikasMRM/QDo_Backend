import express from "express";
import taskController from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { fileUpload } from "../middleware/fileUploadMiddleware.js";

const router = express.Router();

//@Auth user add task
router.route("/").post(protect, fileUpload, taskController.createNewTask);

//@Auth user view tasks
router.route("/").get(protect, taskController.getTasksByUser);

//@Auth user view tasks
router.route("/:id").put(protect, taskController.updateTaskStatus);

export default router;
