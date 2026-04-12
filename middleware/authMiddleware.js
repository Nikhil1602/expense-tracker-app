const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

function authMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch (err) {

        logger.error("=======================================>");
        logger.error(`ERROR WHILE AUTH MIDDLEWARE: ${err.stack || err.message}`);
        logger.error("=======================================>");
        return res.status(401).json({ message: "Invalid token" });

    }

}

module.exports = authMiddleware;