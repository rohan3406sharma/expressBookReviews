const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("../booksdb.js");
const { verifyToken } = require('../middleware/auth.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
}

// User registration
regd_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(201).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(400).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Username and password are required." });
});

// User login
regd_users.post("/customer/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in. Username and password are required." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password,
      username: username
    }, 'fingerprint_customer', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).json({ success: true, token: accessToken, message: "User successfully logged in" });
  } else {
    return res.status(401).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add or update a book review
regd_users.put("/customer/auth/review/:isbn", verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    let review = req.body.review;
    let reviewer = req.session.authorization ? req.session.authorization.username : req.user.username;
    if (review) {
      book.reviews[reviewer] = review;
      books[isbn] = book;
    }
    res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been added/updated.` });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/customer/auth/review/:isbn", verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  let reviewer = req.session.authorization ? req.session.authorization.username : req.user.username;

  let book = books[isbn];
  if (book) {
    if (book.reviews[reviewer]) {
      delete book.reviews[reviewer];
      res.status(200).json({ message: `Reviews for the ISBN ${isbn} posted by the user ${reviewer} deleted.` });
    } else {
      res.status(404).json({ message: "Review not found for this user." });
    }
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
