const mongoose = require('mongoose');

const coverImageBasePath = 'uploads/bookCovers';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'What is this book if it has no title?']
  },
  subtitle: {
    type: String,
    required: false
  },
  authorDetails: {
    type: String,
    required: true
  },
  genreOfBook: {
    type: String,
    required: false
  },
  numberOfPages: {
    type: Number,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  coverImageName: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Book', bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;