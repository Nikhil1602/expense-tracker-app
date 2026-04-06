const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

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