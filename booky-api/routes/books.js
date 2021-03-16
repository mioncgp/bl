const { Book, validate } = require("../models/book");
const { Genre } = require("../models/genre");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const _ = require("lodash");
const router = express.Router();

// router.get("/:page", async (req, res) => {
//   const books = await Book.find().select("-__v").sort("name");
//   const startIndex = (parseInt(req.params.page) - 1) * 3;
//   const nb = await _(books).slice(startIndex).take(3).value();
//   res.send(nb);
// });

router.get("/", async (req, res) => {
  const books = await Book.find().select("-__v").sort("name");
  res.send(books);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const book = new Book({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    author: req.body.author,
    selectedTextFile: req.body.selectedTextFile,
    selectedCoverFile: req.body.selectedCoverFile,
    publishDate: moment().toJSON(),
  });
  await book.save();

  res.send(book);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      author: req.body.author,
      selectedCoverFile: req.body.selectedCoverFile,
      selectedTextFile: req.body.selectedTextFile,
    },
    { new: true }
  );

  if (!book)
    return res.status(404).send("The book with the given ID was not found.");

  res.send(book);
});

router.put("/:id/increase", [auth], async (req, res) => {
  //add validation

  const obj = await Book.findById(req.params.id).select("selectedTextFile");

  const genre = await Genre.findById(req.body.genreId);

  if (!genre) return res.status(400).send("Invalid genre.");
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      $inc: { downloads: 1 },
      author: req.body.author,
      selectedCoverFile: req.body.selectedCoverFile,
      selectedTextFile: obj.selectedTextFile,
    },
    { new: true }
  );
  if (!book)
    return res.status(404).send("The book with the given ID was not found.");

  res.send(book);
});

router.post("/like", [auth], async (req, res) => {
  // refactor
  const { userId, bookId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(bookId))
    return res.status(404).send(`No book like this`);
  const book = await Book.findById(bookId);
  const index = book.likes.findIndex((id) => id === userId);
  if (index === -1) {
    book.likes.push(userId);
  } else {
    book.likes = book.likes.filter((id) => id !== userId);
  }
  const updatedBook = await Book.findByIdAndUpdate(bookId, book, {
    new: true,
  });
  res.status(200).json(updatedBook);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const book = await Book.findByIdAndRemove(req.params.id);

  if (!book)
    return res.status(404).send("The book with the given ID was not found.");

  res.send(book);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const book = await Book.findById(req.params.id).select("-__v");

  if (!book)
    return res.status(404).send("The book with the given ID was not found.");

  res.send(book);
});

module.exports = router;
