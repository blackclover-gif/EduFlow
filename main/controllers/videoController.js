const Video = require('../models/Video');

const path = require('path');

const fs = require('fs');

// ================= UPLOAD VIDEO =================

const uploadVideo = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        message: 'No Video Uploaded'
      });

    }

    const hasQuiz =
    req.body.hasQuiz === 'yes';

    const video =
    await Video.create({

      title: req.body.title,

      description:
      req.body.description,

      course:
      req.body.course,

      professor:
      req.user.id,

      hasQuiz,

      videoUrl:
      `/uploads/${req.file.filename}`

    });

    res.status(201).json({

      success: true,

      message:
      'Lecture Uploaded',

      video

    });

  } catch (err) {

    if (req.file) {

      fs.unlink(
        req.file.path,
        () => {}
      );

    }

    res.status(500).json({
      message: err.message
    });

  }

};

// ================= GET VIDEOS =================

const getVideos = async (req, res) => {

  try {

    const videos =
    await Video.find()

    .populate(
      'professor',
      'name email'
    )

    .sort({
      createdAt: -1
    });

    res.json(videos);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

// ================= DELETE VIDEO =================

const deleteVideo = async (req, res) => {

  try {

    const video =
    await Video.findById(
      req.params.id
    );

    if (!video) {

      return res.status(404).json({
        message: 'Video Not Found'
      });

    }

    const filePath =
    path.join(
      __dirname,
      '..',
      video.videoUrl
    );

    if (fs.existsSync(filePath)) {

      fs.unlinkSync(filePath);

    }

    const Quiz =
    require('../models/Quiz');

    await Quiz.findOneAndDelete({
      lectureId: req.params.id
    });

    const Score =
    require('../models/Score');

    await Score.deleteMany({
      lectureId: req.params.id
    });

    await Video.findByIdAndDelete(
      req.params.id
    );

    res.json({

      success: true,

      message:
      'Lecture Deleted'

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message
    });

  }

};

// ================= EXPORTS =================

module.exports = {

  uploadVideo,

  getVideos,

  deleteVideo

};