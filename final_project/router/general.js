const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;


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

// Task 10: Get all books – Using async/await
public_users.get('/books', async function (req, res) {
  const get_all_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify(books, null, 4)));
  });
  await get_all_books;
  console.log("Await for Task 10 resolved");
});

// Task 11: Search by ISBN – Using Promises
public_users.get('/books/isbn/:isbn', function (req, res) {
  const get_book_by_isbn = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify(books[req.params.isbn], null, 4)));
  });
  get_book_by_isbn.then(() => console.log("Promise for Task 11 resolved"));
});

// Task 12: Search by Author using Promises
public_users.get('/books/author/:author', function (req, res) {
  const get_books_by_author = new Promise((resolve, reject) => {
    const booksByAuthor = {};
    for (const book in books) {
      if (books[book].author === req.params.author) {
        booksByAuthor[book] = books[book];
      }
    }
    resolve(res.send(JSON.stringify(booksByAuthor, null, 4)));
  });
  get_books_by_author.then(() => console.log("Promise for task 12 resolved"));
});

// Task 13: Search by Title using async/await
public_users.get('/books/title/:title', async function (req, res) {
  const get_books_by_title = new Promise((resolve, reject) => {
    const booksByTitle = {};
    for (const book in books) {
      if (books[book].title === req.params.title) {
        booksByTitle[book] = books[book];
      }
    }
    resolve(res.send(JSON.stringify(booksByTitle, null, 4)));
  });
  await get_books_by_title;
  console.log("Await for Task 13 resolved");
});


module.exports.general = public_users;
