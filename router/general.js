const express = require('express');
const axios = require('axios'); // Imported axios for async requests
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


// ==========================================
// IBM COURSERA ASYNC TASKS (10 - 13)
// ==========================================

// TASK 10: Create an async callback function to retrieve all books.
public_users.get('/async/books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// TASK 11: Search by ISBN using Promises.
public_users.get('/async/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/books/isbn/${isbn}`)
        .then(response => {
            return res.status(200).json(response.data);
        })
        .catch(error => {
            return res.status(500).json({ message: error.message });
        });
});

// TASK 12: Search by Author using async/await.
public_users.get('/async/books/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const response = await axios.get(`http://localhost:5000/books/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// TASK 13: Search by Title using async/await.
public_users.get('/async/books/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const response = await axios.get(`http://localhost:5000/books/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports.general = public_users;
