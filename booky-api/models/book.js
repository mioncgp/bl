const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const Book = mongoose.model(
  "Books",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    author: {
      type: String,
      reqired: true,
    },
    selectedTextFile: {
      type: String,
      reqired: true,
    },
    selectedCoverFile: {
      type: String,
      reqired: true,
    },

    downloads: {
      type: Number,
      default: 0,
    },
    likes: { type: [String], default: [] },
  })
);

function validateBook(book) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    downloads: Joi.number(),
    author: Joi.string().required(),
    selectedTextFile: Joi.string().required(),
    selectedCoverFile: Joi.string().required(),
  };

  return Joi.validate(book, schema);
}

exports.Book = Book;
exports.validate = validateBook;
