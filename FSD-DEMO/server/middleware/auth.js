const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied (Token not found)");

  try {
    const user = jwt.verify(token, process.env.JWTSECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};