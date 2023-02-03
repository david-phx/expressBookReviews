const e = require('express');
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  let usersWithSameName = users.filter((user) => {
    return user.username === username
  });
  if (usersWithSameName.length > 0) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User " + username + " successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (book && req.body.review) {
    books[req.params.isbn].reviews[req.session.authorization.username] = req.body.review;
    res.send("Review for ISBN " + req.params.isbn + " by user " + req.session.authorization.username + " added!");
  }
  else {
    res.send("Unable to add/edit review!");
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (book) {
    delete books[req.params.isbn].reviews[req.session.authorization.username];
    res.send("Review for ISBN " + req.params.isbn + " by user " + req.session.authorization.username + " deleted!");
  }
  else {
    res.send("Unable to delete review!");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
