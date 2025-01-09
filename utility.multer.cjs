const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});


const upload = multer({ storage , limits:"100mb" });
module.exports =  upload ;


