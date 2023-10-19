import { Router } from "express";

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

export default routerUser;
