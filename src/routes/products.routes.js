import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import { authorization, passportError } from "../utils/messageErrors.js";

const routerProd = Router();

routerProd.get("/", productsController.getProducts);
routerProd.get("/:pid", productsController.getProduct);
routerProd.post(
  "/",
  passportError("jwt"),
  authorization(["user", "admin"]),
  productsController.postProduct
);
routerProd.put(
  "/:pid",
  passportError("jwt"),
  authorization(["user", "admin"]),
  productsController.putProduct
);
routerProd.delete(
  "/:pid",
  passportError("jwt"),
  authorization(["user", "admin"]),
  productsController.deleteProduct
);
routerProd.get(
  "/mockingproducts/:cantProducts",
  productsController.getMockingProducts
);

export default routerProd;
