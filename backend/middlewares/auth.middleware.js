const { verifyToken } = require("../utils/token.util");

module.exports = (req, res, next) => {
  const token =
    req.cookies?.authToken ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  console.log("profiles");
  console.log(req.cookies.authToken);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    console.log("verifytoken going to next");
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
