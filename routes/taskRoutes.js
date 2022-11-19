import express from "express";
import taskController from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { fileUpload } from "../middleware/fileUploadMiddleware.js";
import cors from "cors";

const router = express.Router();

//@Auth user add task
router.route("/").post(protect, fileUpload, taskController.createNewTask);

//@Auth user view tasks
router.route("/").get(protect, taskController.getTasksByUser);

//@Auth user filter tasks
router.route("/filter").post(protect, taskController.filterTasksData);

//@Auth user view task
router.route("/:id").get(protect, taskController.viewSingleTask);

//@Auth user update task(name, status/description one or many)
router.route("/:id").put(protect, taskController.updateTaskStatus);

//@Auth user delete task
router.route("/:id").delete(protect, taskController.deleteTask);

// View/Download task attachment
router.route("/download/:id/:token").get(
  cors({
    exposedHeaders: ["Content-Disposition"],
  }),
  taskController.downloadAttachment
);

export default router;
