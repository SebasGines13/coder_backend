import { Router } from "express";
import userModel from "../models/users.models.js";
import { createHash, validatePassword } from "../utils/bcrypt.js";

const sessionRouter = Router();

sessionRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (req.session.user)
      res.status(200).send({ resultado: "Login ya existente", message: email });
    const user = await userModel.findOne({ email: email });
    if (user) {
      if (validatePassword(password, user.password)) {
        // Login
        req.session.user = {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          age: user.age,
        };
        res.status(200).send({ resultado: "Login válido", message: user });
      } else {
        res.status(401).send({ resultado: "Unauthorized", message: user });
      }
    } else {
      res.status(404).send({ resultado: "Not found", message: user });
    }
  } catch (e) {
    res.status(400).send({ error: `Error en login: ${e}` });
  }
});

sessionRouter.get("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy();
  }
  res.status(200).send({ resultado: "Login eliminado" });
});

sessionRouter.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;
  try {
    const hashPassword = createHash(password);
    const response = await userModel.create({
      email: email,
      password: hashPassword,
      first_name: first_name,
      last_name: last_name,
      age: age,
    });
    res.send(200).send({ respuesta_: "Usuario creado", respuesta: response });
  } catch (e) {
    res.status(400).send({ error: `Error en crear usuario: ${e}` });
  }
});

export default sessionRouter;
