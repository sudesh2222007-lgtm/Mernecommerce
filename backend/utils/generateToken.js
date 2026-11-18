const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || "norra_luxury_secret_jwt_key_2026";
  const data =
    typeof payload === "object" && payload !== null
      ? payload
      : { id: payload };
  return jwt.sign(data, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
