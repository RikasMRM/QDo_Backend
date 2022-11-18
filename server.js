import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./dbconfig/database.js";

//env file config
dotenv.config();

//connect to the database
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Api is working");
});

const prot = process.env.PORT;

app.listen(
  prot,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${prot}`)
);
