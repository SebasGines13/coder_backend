import { Router } from "express";
import { CartManager } from "../controllers/cartManager.js";

const cartManager = new CartManager("src/models/carts.json");
const routerCart = Router();

routerCart.post("/", async (req, res) => {
  const cart = await cartManager.addCart();
  res.status(200).send(cart);
});

routerCart.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getCartById(cid);
  cart
    ? res.status(200).send(cart.products)
    : res.status(404).send("Carrito no existente");
});

routerCart.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartManager.addProduct(cid, pid);
  cart
    ? res.status(200).send(cart)
    : res.status(404).send("Carrito no existente");
});

export default routerCart;
