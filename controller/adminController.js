const cloudinary = require('../utils/cloudinary');
const User = require('../Models/user');
const Movie = require('../Models/movies');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = {
  uploadImg: async (req, res) => {
    try {
      const img = req.file.path;

      await cloudinary.uploader
        .upload(img, {
          public_id: `${Date.now()}`,
          resource_type: 'image',
        })
        .then((result) => {
          res.status(200).json({ imgurl: result.secure_url });
        })
        .catch((error) => {
          console.error('Upload error:', error);
          res.status(500).json({ error: 'Failed to upload Image' });
        });
    } catch (error) {
      console.log(error);
    }
  },
  uploadVideo: async (req, res) => {
    try {
      const video = req.file.path;
      await cloudinary.uploader
        .upload(video, {
          public_id: `${Date.now()}`,
          resource_type: 'video',
        })
        .then((result) => {
          res.status(200).json({
            videourl: result.secure_url,
            id: result.public_id,
            result,
          });
        })
        .catch((error) => {
          console.error('Upload error:', error);
          res.status(500).json({ error: 'Failed to upload video' });
        });
    } catch (error) {
      console.log(error);
    }
  },

  addMovie: async (req, res) => {
    try {
      const { name, description, thumbnail, trailer } = req.body;

      const movie = await new Movie({
        name,
        description,
        thumbnail,
        trailer,
      });
      await movie.save();
      res.status(200).json({ message: 'New Movie Added', added: movie });
    } catch (error) {
      console.log(error);
    }
  },
  getmovies: async (req, res) => {
    try {
      const result = await Movie.find();

      res.status(200).json({ data: result });
    } catch (error) {
      console.log(error);
    }
  },
  getmoviebyid: async (req, res) => {
    try {
      const { id } = req.query;
      const result = await Movie.findById(id);

      res.status(200).json({ data: result });
    } catch (error) {
      console.log(error);
    }
  },
  getSingleMovie: async (req, res) => {
    try {
      const { id } = req.query;
      const result = await Movie.findById(id);

      res.status(200).json({ data: result });
    } catch (error) {
      console.log(error);
    }
  },

  adduser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await User.findOne({ email });
      if (user) {
        res.status(403).json({ message: 'User already exists' });
      }

      const addUser = await new User({
        name,
        email,
        password,
      });
      await addUser.save();
      res.status(200).json({ message: 'New User Added ' });
    } catch (error) {
      console.log(error);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (user) {
        const isTrue = await bcrypt.compare(password, user.password);
        if (isTrue) {
          const token = jwt.sign(
            { username: user.name, id: user._id.toString() },
            process.env.SECRET_KEY
          );
          res.status(200).json({
            message: 'Logged in',
            token: token,
            rootId: user._id.toString(),
            rootUser: user.name,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  editmovie: async (req, res) => {
    try {
      const { name, description, thumbnail, trailer, id } = req.body;

      const movie = await Movie.findByIdAndUpdate(id, {
        name,
        description,
        thumbnail,
        trailer,
      });
      await movie.save();
      res.status(200).json({ message: 'Date is Updated' });
    } catch (error) {
      console.log(error);
    }
  },
  deletemovie: async (req, res) => {
    try {
      const { id } = req.query;
      await Movie.findByIdAndDelete(id);
      res.status(204).json({ message: 'Successfully Deleted' });
    } catch (error) {
      console.log(error);
      res.status(500);
    }
  },
  addComment: async (req, res) => {
    try {
      const { newcomments, movieId } = req.body;
      const postData = {
        text: newcomments,
        postedBy: req.user.id,
      };

      const movie = await Movie.findByIdAndUpdate(movieId, {
        $push: { comments: postData },
      }).populate({
        path: 'comments',
        populate: {
          path: 'postedBy',
          select: '_id name',
        },
      });
      await movie.save();
      res.status(200).json({ message: 'Comment Added' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  showComments: async (req, res) => {
    try {
      const { movieId } = req.query;
      // const movie = await Movie.findById(movieId).populate({
      //   path: 'comments',
      //   populate: {
      //     path: 'postedBy',
      //     select: '_id name',
      //   },
      // });

      const movie = await Movie.findById(movieId).lean(); // Use lean() to get a plain JavaScript object

      // Iterate over the comments and fetch the user details for each comment
      for (const comment of movie.comments) {
        const user = await User.findById(comment.postedBy).lean(); // Fetch user details using the postedBy ObjectId
        comment.postedBy = user.name; // Replace the ObjectId with the user's name
      }

      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.status(200).json(movie.comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  editcomment: async (req, res) => {
    console.log('Comment Edited');
    try {
      const { comment, movieId, commentId } = req.body;

      const movie = await Movie.findOneAndUpdate(
        { 'comments._id': commentId },
        { $set: { 'comments.$.text': comment } },
        { new: true }
      );

      // for (const comment of movie.comments) {
      //   if(comment._id==)
      //   const user = await User.findById(comment.postedBy).lean(); // Fetch user details using the postedBy ObjectId
      //   comment.postedBy = user.name; // Replace the ObjectId with the user's name
      // }
      await movie.save();
      res.status(200).json({ message: 'Comment Added' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
