import jwt from "jsonwebtoken";

export default async (req, res, fn) => {
  const token = req.headers["x-auth-token"];
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = decoded;
  } catch (ex) {
    return res.status(400).send("Invalid token.");
  }
  await fn();
};
