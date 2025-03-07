import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;
const REFRESH_SECRET_KEY =
  process.env.JWT_REFRESH_SECRET;

export const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export const authenticateRefreshToken = (req, res, next) => {
  const token = req.body.refreshToken;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, REFRESH_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export default { authenticateToken, authenticateRefreshToken };
