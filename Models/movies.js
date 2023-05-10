const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./user');
const movieSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  trailer: {
    type: String,
    required: true,
  },
  comments: [
    {
      text: { type: String },
      postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
  ],
});

module.exports = mongoose.model('Movie', movieSchema);
