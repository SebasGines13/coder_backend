import { Router } from "express";
import passport from "passport";
import { passportError } from "../utils/messageErrors.js";
import sessionController from "../controllers/sessions.controller.js";
import CustomError from "../services/errors/customError.js";
import EErrors from "../services/errors/enums.js";
import { generateUserErrorInfo } from "../services/errors/info.js";

const routerSession = Router();

routerSession.post(
  "/register",
  (req, res, next) => {
    const { first_name, last_name, email } = req.body;
    try {
      if (!last_name || !first_name || !email) {
        CustomError.createError({
          name: "User creation error",
          cause: generateUserErrorInfo({ first_name, last_name, email }),
          message: "One or more properties were incomplete or not valid.",
          code: EErrors.INVALID_USER_ERROR,
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  },
  passport.authenticate("register"),
  sessionController.postRegister
);

routerSession.post(
  "/login",
  passport.authenticate("login"),
  sessionController.postSession
);

routerSession.get(
  "/current",
  passportError("jwt"),
  sessionController.getCurrentSession
);

routerSession.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  sessionController.getGithubCreateUser
);

routerSession.get(
  "/githubSession",
  passport.authenticate("github"),
  sessionController.getGithubSession
);

routerSession.get("/logout", sessionController.getLogout);

export default routerSession;
