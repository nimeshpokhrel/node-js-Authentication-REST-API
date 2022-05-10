const jwt = require("jsonwebtoken");

const privateRoutesAuth = (request, response, next) => {
  const loginToken = request.header("auth-token");
  if (!loginToken) return response.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(loginToken, process.env.TOKEN_SECRET);
    request.user = verified;
    next();
  } catch (error) {
    response.status(400).send("Invalid Token");
  }
};

module.exports = { privateRoutesAuth };
