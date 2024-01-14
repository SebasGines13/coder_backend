import { Router } from "express";
import productModel from "../models/products.models.js";

const HOME = "home";
const SOCKETGETPRODUCTS = "realTimeProducts";
const SOCKETADDPRODUCT = "newProduct";
const CHAT = "chat";
const PRODUCTS = "products";
const LOGIN = "login";
const REGISTER = "register";

const staticRouter = Router();

staticRouter.post("/" + REGISTER, async (req, res) => {
  res.render(REGISTER, {
    rutaCSS: REGISTER,
    rutaJS: REGISTER,
  });
});

staticRouter.get("/" + HOME, async (req, res) => {
  const productos = await productModel.find();
  const productsList = productos.map((item) => item.toObject());
  res.render(HOME, {
    rutaCSS: HOME,
    rutaJS: HOME,
    productos: productsList,
    user: req.session.user,
  });
});

staticRouter.get("/" + SOCKETGETPRODUCTS, async (req, res) => {
  const productos = await productModel.find();
  const productsList = productos.map((item) => item.toObject());
  res.render(SOCKETGETPRODUCTS, {
    rutaCSS: SOCKETGETPRODUCTS,
    rutaJS: SOCKETGETPRODUCTS,
    productos: productsList,
  });
});

staticRouter.get("/" + SOCKETADDPRODUCT, async (req, res) => {
  res.render(SOCKETADDPRODUCT, {
    rutaCSS: SOCKETADDPRODUCT,
    rutaJS: SOCKETADDPRODUCT,
  });
});

staticRouter.get("/" + CHAT, (req, res) => {
  res.render(CHAT, {
    rutaCSS: CHAT,
    rutaJS: CHAT,
  });
});

staticRouter.get("/" + PRODUCTS, async (req, res) => {
  res.render(PRODUCTS, {
    rutaCSS: PRODUCTS,
    rutaJS: PRODUCTS,
    user: req.session.user,
  });
});

staticRouter.get("/" + LOGIN, async (req, res) => {
  res.render(LOGIN, {
    rutaCSS: LOGIN,
    rutaJS: LOGIN,
    user: req.session.user,
  });
});

export default staticRouter;
