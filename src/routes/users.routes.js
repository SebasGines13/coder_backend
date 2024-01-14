import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //cb => callback
    cb(null, "src/documents/"); //el null hace referencia a que no envie errores
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`); //concateno la fecha actual en ms con el nombre del archivo
  },
});

const upload = multer({ storage: storage });

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
    user: req.session.user,
  });
});

routerUser.post("/password-recovery", usersController.passwordRecovery);
routerUser.post("/reset-password/:token", usersController.passwordReset);
routerUser.post(
  "/:uid/documents",
  upload.array("documents"),
  usersController.uploadDocuments
);

routerUser.get("/", usersController.getAllUsers);
routerUser.delete("/", usersController.deleteInactiveUsers);

export default routerUser;
