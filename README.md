# Express Book Reviews

This is a complete Node.js + Express REST API project matching the IBM Developer Skills Network final project requirements.

## Features
- General routes for retrieving books by ISBN, author, and title
- User registration and login using JWT
- Authenticated routes for users to post, modify, and delete their own book reviews
- In-memory data store for users and books

## Installation

Install dependencies using npm:
```bash
npm install
```

## Running the Application

Start the server using Node:
```bash
npm start
```
Or start in development mode using nodemon:
```bash
npm run dev
```

The server will run on `http://localhost:5000`.

## API Endpoints

### Public Routes
- **Get all books**
  - `GET /books`
- **Get book by ISBN**
  - `GET /books/isbn/:isbn`
- **Get books by author**
  - `GET /books/author/:author`
- **Get books by title**
  - `GET /books/title/:title`
- **Get book reviews**
  - `GET /books/review/:isbn`

### Authentication Routes
- **Register User**
  - `POST /register`
  - Body (JSON): `{ "username": "your_username", "password": "your_password" }`
- **Login User**
  - `POST /customer/login`
  - Body (JSON): `{ "username": "your_username", "password": "your_password" }`

### Authenticated Routes
*Requires valid JWT token in the `Authorization` header (`Bearer <token>`) or session cookie.*

- **Add/Update Review**
  - `PUT /customer/auth/review/:isbn`
  - Body (JSON): `{ "review": "Great book!" }`
- **Delete Review**
  - `DELETE /customer/auth/review/:isbn`

## Sample JWT Usage

1. Register a new user:
```bash
curl -X POST http://localhost:5000/register \
-H "Content-Type: application/json" \
-d '{"username": "rahul", "password": "password123"}'
```

2. Login to receive your token:
```bash
curl -X POST http://localhost:5000/customer/login \
-H "Content-Type: application/json" \
-d '{"username": "rahul", "password": "password123"}'
```

3. Post a review using the token (from header or session):
```bash
curl -X PUT http://localhost:5000/customer/auth/review/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-d '{"review": "Excellent read!"}'
```
