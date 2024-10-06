const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(403).json({
            message : "Invalid user!"
        });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, secret);

    if (decoded) {
        req.userId = decoded.userId; // Not usefull while signup/signin
        next();
    } else {
        res.status(403).json({
            message: "Authorization failed"
        });
    }
}

module.exports = authMiddleware;