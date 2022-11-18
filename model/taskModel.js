import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
      default: "Todo",
      // Todo | Inprogress | Done
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    //attachment data
    filePath: {
      type: String,
      required: false,
    },
    fileName: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("tasks", taskSchema);
export default Task;
