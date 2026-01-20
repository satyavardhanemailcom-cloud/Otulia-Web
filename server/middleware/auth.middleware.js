const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "NO_TOKEN",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "INVALID_TOKEN_FORMAT",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({
      error: "TOKEN_INVALID_OR_EXPIRED",
    });
  }
};

module.exports = authMiddleware;
