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
      res.status(200).send({ resultado: "Ok", mensaje: respuesta });
    }
  } catch (e) {
    res.status(400).send({ error: `Error al actualizar carrito: ${error}` });
  }
});

cartRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  try {
    const cart = await cartModel.findById(cid);
    if (cart) {
      products.forEach((product) => {
        const productIndex = cart.products.findIndex(
          (p) => p.id_prod.id.toString() == product.id_prod
        );
        productIndex !== -1
          ? (cart.products[productIndex].quantity += product.quantity)
          : cart.products.push(product);
      });
      const respuesta = await cart.save();
      res.status(200).send({ resultado: "OK", mensaje: respuesta });
    } else {
      res.status(404).send({ error: "Carrito no existente" });
    }
  } catch (error) {
    res.status(400).send({ error: `Error al actualizar carrito: ${error}` });
  }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await cartModel.findById(cid);
    if (cart) {
      const productIndex = cart.products.findIndex((product) =>
        product.id_prod._id.equals(pid)
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity;
        const respuesta = await cart.save();
        res.status(200).send({
          resultado: "OK",
          mensaje: respuesta,
        });
      } else {
        res.status(404).send({ error: "Producto no existente en el carrito" });
      }
    } else {
      res.status(404).send({ error: "Carrito no existente" });
    }
  } catch (error) {
    res.status(400).send({
      error: `Error al actualizar la cantidad del producto en el carrito: ${error}`,
    });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findByIdAndUpdate(cid, { products: [] });
    cart
      ? res.status(200).send({ resultado: "OK", mensaje: cart })
      : res
          .status(404)
          .send({ resultado: "Carrito no existente", mensaje: cart });
  } catch (error) {
    res.status(400).send({ error: `Error al vaciar el carrito: ${error}` });
  }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartModel.findById(cid);
    if (cart) {
      const productIndex = cart.products.findIndex(
        (prod) => prod.id_prod.id == pid
      );
      if (productIndex !== -1) {
        const deletedProduct = cart.products[productIndex];
        cart.products.splice(productIndex, 1);
        await cart.save();
        res.status(200).send({ resultado: "OK", mensaje: deletedProduct });
      } else {
        res
          .status(404)
          .send({ resultado: "Producto no existente", mensaje: cart });
        return;
      }
    } else {
      res
        .status(404)
        .send({ resultado: "Carrito no existente", mensaje: cart });
    }
  } catch (error) {
    res.status(400).send({ error: `Error al eliminar carrito: ${error}` });
  }
});

export default cartRouter;
