import express from "express";
import taskController from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { fileUpload } from "../middleware/fileUploadMiddleware.js";

const router = express.Router();

//@Public Register user
router.route("/").post(protect, fileUpload, taskController.createNewTask);

export default router;