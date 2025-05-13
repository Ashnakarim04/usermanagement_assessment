// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//     const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>

//     if (!token) {
//         return res.status(401).json({ message: "Access Denied. No token provided." });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("Decoded JWT:", decoded); // Optional for debugging

//         if (!decoded.userId) {
//             return res.status(400).json({ message: "User ID is missing from token!" });
//         }

//         req.user = { id: decoded.userId }; // Attach user ID to request
//         next();
//     } catch (error) {
//         return res.status(400).json({ message: "Invalid Token" });
//     }
// };

// module.exports = authMiddleware;
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.userId) {
            return res.status(400).json({ message: "User ID is missing from token!" });
        }

        req.user = { id: decoded.userId }; // Attach user ID to request
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
