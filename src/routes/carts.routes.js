import { Router } from "express";
import cartsController from "../controllers/carts.controller.js";
import { authorization, passportError } from "../utils/messageErrors.js";
const routerCart = Router();

routerCart.get("/:cid", cartsController.getCart);
routerCart.post("/", cartsController.postCart);
routerCart.put(
  "/:cid/product/:pid",
  passportError("jwt"),
  authorization(["user", "admin"]),
  cartsController.putProductToCart
);
routerCart.put(
  "/:cid/products/:pid",
  passportError("jwt"),
  authorization(["user", "admin"]),
  cartsController.putQuantity
);
routerCart.put(
  "/:cid",
  passportError("jwt"),
  authorization(["user", "admin"]),
  cartsController.putProductsToCart
);
routerCart.delete(
  "/:cid",
  passportError("jwt"),
  authorization(["user", "admin"]),
  cartsController.deleteCart
);
routerCart.delete(
  "/:cid/products/:pid",
  passportError("jwt"),
  authorization(["user", "admin"]),
  cartsController.deleteProductFromCart
);
routerCart.post("/:cid/purchase", cartsController.purchaseCart);

export default routerCart;
