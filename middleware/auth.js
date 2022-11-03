const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];

  if (!token) return res.status(403).send("Access denied. Missing token");

  try {
    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Access denied. Invalid token");
  }
  return next();
};

module.exports = auth;
