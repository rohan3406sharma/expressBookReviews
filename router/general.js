const express = require('express');
let books = require("../booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Root route
public_users.get('/', (req, res) => {
    res.status(200).send("Welcome to the Express Book Reviews API! Access /books to see the list of books.");
});

// Get the book list available in the shop
public_users.get('/books', (req, res) => {
    res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});
  
// Get book details based on author
public_users.get('/books/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    const result = [];
    for (let isbn in books) {
        if (books[isbn].author.toLowerCase() === author) {
            result.push(books[isbn]);
        }
    }
    if (result.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: "Books by this author not found" });
    }
});

// Get all books based on title
public_users.get('/books/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const result = [];
    for (let isbn in books) {
        if (books[isbn].title.toLowerCase() === title) {
            result.push(books[isbn]);
        }
    }
    if (result.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: "Books with this title not found" });
    }
});

// Get book review
public_users.get('/books/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
