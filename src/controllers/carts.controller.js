import cartModel from "../models/carts.models.js";
import productModel from "../models/products.models.js";
import userModel from "../models/users.models.js";
import "dotenv/config";
import logger from "../utils/logger.js";

const REDIRECTPURCHASE = `http://localhost:${process.env.PORT}/api/tickets`;

const getCart = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findById(cid);
    cart
      ? res.status(200).send(cart.products)
      : res.status(404).send("Carrito no existente");
  } catch (error) {
    logger.error(`Error al consultar carrito: ${error}`);
    res.status(400).send({ error: `Error al consultar carrito: ${error}` });
  }
};

const postCart = async (req, res) => {
  try {
    const resultado = await cartModel.create({});
    res.status(200).send(resultado);
  } catch (error) {
    logger.error(`Error al crear carrito: ${error}`);
    res.status(400).send({ error: `Error al crear carrito: ${error}` });
  }
};

const putProductToCart = async (req, res) => {
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
    logger.error(`Error al actualizar carrito: ${error}`);
    res.status(400).send({ error: `Error al actualizar carrito: ${error}` });
  }
};

const putProductsToCart = async (req, res) => {
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
      logger.error("Carrito no existente");
      res.status(404).send({ error: "Carrito no existente" });
    }
  } catch (error) {
    logger.error(`Error al actualizar carrito: ${error}`);
    res.status(400).send({ error: `Error al actualizar carrito: ${error}` });
  }
};

const putQuantity = async (req, res) => {
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
        logger.error("Producto no existente en el carrito");
        res.status(404).send({ error: "Producto no existente en el carrito" });
      }
    } else {
      logger.error("Carrito no existente");
      res.status(404).send({ error: "Carrito no existente" });
    }
  } catch (error) {
    logger.error(
      `Error al actualizar la cantidad del producto en el carrito: ${error}`
    );
    res.status(400).send({
      error: `Error al actualizar la cantidad del producto en el carrito: ${error}`,
    });
  }
};

const deleteCart = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findByIdAndUpdate(cid, { products: [] });
    if (!cart) {
      logger.error("Carrito no existente");
      res
        .status(404)
        .send({ resultado: "Carrito no existente", mensaje: cart });
    } else {
      res.status(200).send({ resultado: "OK", mensaje: cart });
    }
    return;
  } catch (error) {
    logger.error(`Error al vaciar el carrito: ${error}`);
    res.status(400).send({ error: `Error al vaciar el carrito: ${error}` });
  }
};

const deleteProductFromCart = async (req, res) => {
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
        logger.error("Producto no existente");
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
    logger.error(`Error al eliminar carrito: ${error}`);
    res.status(400).send({ error: `Error al eliminar carrito: ${error}` });
  }
};

const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findById(cid);
    const products = await productModel.find();

    if (cart) {
      const user = await userModel.find({ cart: cart._id });
      const email = user[0].email;
      let amount = 0;
      const purchaseItems = [];
      cart.products.forEach(async (item) => {
        const product = products.find(
          (prod) => prod._id == item.id_prod.toString()
        );
        if (product.stock >= item.quantity) {
          // Calculo descuento del 20% si es que es un usuario premium
          if (user.rol === "premium") {
            amount += price * quantity * 0.8;
          } else {
            amount += price * quantity;
          }
          amount += product.price * item.quantity;
          product.stock -= item.quantity;
          await product.save();
          purchaseItems.push(product.title);
        }
      });
      await cartModel.findByIdAndUpdate(cid, { products: [] }); // Limpio el carrito
      res.redirect(`${REDIRECTPURCHASE}?amount=${amount}&email=${email}`); // Creo el ticket
    } else {
      res.status(404).send({ resultado: "Not Found", message: cart });
    }
  } catch (error) {
    logger.error(`Error al consultar carrito: ${error}`);
    res.status(400).send({ error: `Error al consultar carrito: ${error}` });
  }
};

const cartsController = {
  getCart,
  postCart,
  putProductsToCart,
  putProductToCart,
  putQuantity,
  deleteCart,
  deleteProductFromCart,
  purchaseCart,
};

export default cartsController;
