const express = require('express');
const session = require('express-session');
const cors = require('cors');

const genl_routes = require('./router/general.js').general;
const auth_routes = require('./router/auth_users.js').authenticated;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

app.use("/", genl_routes);
app.use("/", auth_routes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
