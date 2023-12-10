import "dotenv/config";
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
  return token;
};

export const authToken = (req, res, next) => {
  const authHeader = req.cookies.jwtCookie;

  if (!authHeader) {
    return res.status(401).send({ error: "Usuario no autenticado" });
  }

  const token = authHeader.split(" ")[1]; // Separo en dos el token y me quedo con el token en sí
  jwt.sign(token, process.env.JWT_SECRET, (error, credentials) => {
    if (error) {
      logger.error(
        `[ERROR][${new Date().tolocaleDateString()} - ${new Date().tolocaleTimeString()}] Ha ocurrido un error: ${
          error.message
        }`
      );
      return res.status(403).send({ error: "Usuario no autorizado" });
    }
    //descifro el token
    req.user = credentials.user;
    next();
  });
};
