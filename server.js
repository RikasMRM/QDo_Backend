import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./dbconfig/database.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

//env file config
dotenv.config();

//connect to the database
connectDB();

//init express server
const app = express();
app.use(cors());
app.use(bodyParser.json());

//set upload folder
app.use(express.static("/uploads/"));

//routes
app.get("/", (req, res) => {
  res.send("Api is working");
});
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const port = process.env.PORT;

app.listen(
  port,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
