import { Router } from "express";

const router = Router();

router.get("/register", async (req, res) => {
  res.render("register", {
    rutaCSS: "register",
    rutaJS: "register",
  });
});

router.get("/login", async (req, res) => {
  res.render("login", {
    rutaCSS: "login",
    rutaJS: "login",
  });
});

export default router;
