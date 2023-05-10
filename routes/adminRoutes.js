const express = require('express');
const {
  addMovie,
  uploadImg,
  uploadVideo,
  getmovies,
  getSingleMovie,
  adduser,
  login,
  getmoviebyid,
  editmovie,
  deletemovie,
  addComment,
  showComments,
  editcomment,
} = require('../controller/adminController');
const multer = require('multer');
const authMiddleware = require('../Middleware/authMiddleware');
const router = express.Router();

const storageIMG = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const storageVdo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/videos');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const uploadImage = multer({ storage: storageIMG });
const uploadVdo = multer({ storage: storageVdo });
router.post('/register', adduser);
router.post('/login', login);
router.post('/uploadImg', uploadImage.single('image'), uploadImg);
router.post('/uploadvideo', uploadVdo.single('video'), uploadVideo);
router.post('/addmovie', addMovie);

router.put('/editmovie', editmovie);

router.get('/getmovies', getmovies);
router.get('/getsinglemovie', getSingleMovie);

router.get('/getmoviebyid', getmoviebyid);

router.delete('/deletemovie/', deletemovie);

router.put('/addComment', authMiddleware, addComment);
router.put('/editcoment', editcomment);
router.get('/showcomment', showComments);

module.exports = router;
