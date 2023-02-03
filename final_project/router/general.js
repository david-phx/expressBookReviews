const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User " + username + " successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// TASK 10 - Get the book list available in the shop using promises
public_users.get('/books', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({ books }, null, 4)));
  });
  get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  res.send(JSON.stringify(books[req.params.isbn], null, 4))
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const booksByAuthor = {};
  for (const book in books) {
    if (books[book].author === req.params.author) {
      booksByAuthor[book] = books[book];
    }
  }
  res.send(JSON.stringify(booksByAuthor, null, 4))
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const booksByTitle = {};
  for (const book in books) {
    if (books[book].title === req.params.title) {
      booksByTitle[book] = books[book];
    }
  }
  res.send(JSON.stringify(booksByTitle, null, 4))
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  res.send(JSON.stringify(books[req.params.isbn].reviews, null, 4))
});

module.exports.general = public_users;
