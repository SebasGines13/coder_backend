import "dotenv/config";
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60,
  });
  return token;
};

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.status(401).send("Usuario no autenticado");
  }
  const token = authHeader.split(" ")[1];
  console.log(token);

  jwt.sign(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      req.status(403).send("Token no valido");
    }
    req.user = user;
    next();
  });
};
