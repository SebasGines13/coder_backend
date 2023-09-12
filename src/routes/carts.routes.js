import { Router } from "express";
import cartModel from "../models/carts.models.js";

const cartRouter = Router();

cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findById(cid);
    cart
      ? res.status(200).send(cart.products)
      : res.status(404).send("Carrito no existente");
  } catch (error) {
    res.status(400).send({ error: `Error al consultar carrito: ${error}` });
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    const resultado = await cartModel.create({});
    res.status(200).send(resultado);
  } catch (error) {
    res.status(400).send({ error: `Error al crear carrito: ${error}` });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await cartModel.findById(cid);
    if (cart) {
      cart.products.push({ id_prod: pid, quantity: quantity });
      const respuesta = await cartModel.findByIdAndUpdate(cid, cart); // Actualizo el carrito de mi base de datos con el nuevo producto
      res.status(200).send({ respuesta: "Ok", mensaje: respuesta });
    }
  } catch (e) {
    res.status(400).send({ error: `Error al actualizar carrito: ${error}` });
  }
});

export default cartRouter;
