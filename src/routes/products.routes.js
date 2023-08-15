import { Router } from "express";
import { ProductManager } from "../controllers/productManager.js";

const productManager = new ProductManager("src/models/products.json");
const routerProd = Router();

routerProd.get("/", async (req, res) => {
  const { limit } = req.query;
  const prods = await productManager.getProducts();
  const products = prods.slice(0, limit);
  res.status(200).send(products);
});

routerProd.get("/:id", async (req, res) => {
  const { id } = req.params;
  const prod = await productManager.getProductById(id);
  prod
    ? res.status(200).send(prod)
    : res.status(404).send("Producto no existente");
});

routerProd.post("/", async (req, res) => {
  const confirmacion = await productManager.addProduct(req.body);
  confirmacion
    ? res.status(200).send("Producto creado correctamente!")
    : res
        .status(400)
        .send("Producto ya existente o campos requeridos sin completar");
});

routerProd.put("/:id", async (req, res) => {
  const confirmacion = await productManager.updateProduct(
    req.params.id,
    req.body
  );
  confirmacion
    ? res.status(200).send("Producto actualizado correctamente!")
    : res.status(404).send("Producto no encontrado!");
});

routerProd.delete("/:id", async (req, res) => {
  const confirmacion = await productManager.deleteProduct(req.params.id);
  confirmacion
    ? res.status(200).send("Producto eliminado correctamente!")
    : res.status(404).send("Producto no encontrado!");
});

export default routerProd;
