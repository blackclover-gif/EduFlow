const express = require('express');

const router = express.Router();

const multer = require('multer');

const path = require('path');

const fs = require('fs');

const authMiddleware =
require('../middleware/authMiddleware');

const professorMiddleware =
require('../middleware/roleMiddleware');

const {
  uploadVideo,
  getVideos,
  deleteVideo
} = require('../controllers/videoController');

// ================= UPLOAD FOLDER =================

const uploadDir =
path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {

  fs.mkdirSync(uploadDir, {
    recursive: true
  });

}

// ================= MULTER STORAGE =================

const storage =
multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, uploadDir);

  },

  filename: (req, file, cb) => {

    const unique =
    Date.now() +
    '-' +
    Math.round(Math.random() * 1e9);

    cb(
      null,
      unique +
      path.extname(file.originalname)
    );

  }

});

// ================= MULTER =================

const upload =
multer({

  storage,

  limits: {
    fileSize:
    2 * 1024 * 1024 * 1024
  }

});

// ================= UPLOAD VIDEO =================

router.post(

'/videos/upload',

authMiddleware,

professorMiddleware,

upload.single('video'),

uploadVideo

);

// ================= GET VIDEOS =================

router.get(

'/videos',

authMiddleware,

getVideos

);

// ================= DELETE VIDEO =================

router.delete(

'/videos/:id',

authMiddleware,

professorMiddleware,

deleteVideo

);

// ================= EXPORT ROUTER =================

module.exports = router;