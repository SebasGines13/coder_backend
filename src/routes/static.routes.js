import { Router } from "express";
import productModel from "../models/products.models.js";

const HOME = "home";
const SOCKETGETPRODUCTS = "realTimeProducts";
const SOCKETADDPRODUCT = "newProduct";
const CHAT = "chat";

const staticRouter = Router();

staticRouter.get("/" + HOME, async (req, res) => {
  const productos = await productModel.find();
  const productsList = productos.map((item) => item.toObject());
  res.render(HOME, {
    rutaCSS: HOME,
    productos: productsList,
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

export default staticRouter;
