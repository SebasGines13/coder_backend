import { Router } from "express";
import usersController from "../controllers/users.controller.js";

const routerUser = Router();

const REGISTER = "register";
const LOGIN = "login";

routerUser.get("/" + REGISTER, async (req, res) => {
  res.render(REGISTER, {
    rutaCSS: REGISTER,
    rutaJS: REGISTER,
  });
});

routerUser.get("/" + LOGIN, async (req, res) => {
  res.render(LOGIN, {
    rutaCSS: LOGIN,
    rutaJS: LOGIN,
  });
});

routerUser.post("/password-recovery", usersController.passwordRecovery);
routerUser.post("/reset-password/:token", usersController.passwordReset);

export default routerUser;
