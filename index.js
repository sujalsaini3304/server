import express from "express";
import dotenv from "dotenv";
import User from "./db.modules.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";

dotenv.config({
  path: ".env",
});

// Connection to MongoDBdatabase.
const conn = mongoose.connect(`${process.env.MONGODB_URL}`, {
  dbName: "database",
});
conn.then(() => {
  console.log("Connected to database.");
});
conn.catch(() => {
  console.log("Connection failed to database.");
});

//Creating instance app
const app = express();
const PORT = process.env.PORT;

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server is ready.");
});

// Saving credentials
app.post("/api/database/credentials/saveData", (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })
    .then(() => {
      res.json({
        message: "Data saved",
        status: 1,
      });
    })
    .catch(() => {
      res.json({
        message: "Failed to save data",
        status: 0,
      });
    });
});



// Verify credentials
app.post("/api/database/credentials/verifyData", async (req, res) => {
  const data = await User.findOne({ username: req.body.username })
  if(data){
  const key = data.password;
      const flag = await bcrypt.compare(req.body.password, key);
      if (flag == false) {
        res.json({
          message: "Verify failed",
          status: 0,
        });
      } else {
        res.json({
          message: "Verified",
          status: 1,
        });
      }
    }
    else{
        res.json({
            message: "Verify failed",
            status: 0,
          });
    }
});



// Listen on the defined port
app.listen(PORT, (req, res) => {
  console.log("Server started.");
});
