import express from "express";
import dotenv from "dotenv";
import {User , UserProfile } from "./db.modules.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

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
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

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
    .catch((e) => {
      console.log(e);
      res.json({
        message: "Failed to save data",
        status: 0,
      });
    });
});

// Handling Profile Image
app.post("/api/user/profile/profileImage/upload", async (req, res) => {
  const base64String = req.body.media;
  function saveBase64ToImage(base64String, filePath) {
    // Remove the base64 header if present (i.e., data:image/png;base64,)
    // const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    // Write the base64 data to a file as binary data
    fs.writeFile(filePath, base64String, "base64", (err) => {
      if (err) {
        console.error("Error writing the file:", err);
      } else {
        console.log("Image successfully saved to", filePath);
      }
    });
  }
  const fileName = `userProfileImage.webp`;
  const filePath = `./uploads/${fileName}`;
  saveBase64ToImage(base64String, filePath);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_SECRET, // Click 'View API Keys' above to copy your API secret
  });
  
   await cloudinary.uploader
    .upload(filePath, {
      public_id:  fileName , 
    })
    .then((e)=>{
      UserProfile({
        userId: "676e4aecbbf9273d9fd45086" ,
        profileImageUrl : e.secure_url , 
      })
      res.json({
        message: "Saved",
        imageUrl : UserProfile.findById(req.body.userId).profileImageUrl , 
        status: 1,
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({
        message: "Not Saved",
        imageUrl : "", 
        status: 0,
      });
    });
});



// Verify credentials
app.post("/api/database/credentials/verifyData", async (req, res) => {
  const data = await User.findOne({ username: req.body.username });
  if (data) {
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
  } else {
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
