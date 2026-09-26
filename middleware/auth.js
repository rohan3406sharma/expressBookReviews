const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.header('Authorization');
    
    // Check if token exists in session if not in header
    if (!token && req.session.authorization && req.session.authorization.accessToken) {
        token = req.session.authorization.accessToken;
    }

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, "fingerprint_customer");
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token." });
    }
};

module.exports = { verifyToken };
