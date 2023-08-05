import express from "express";
import { ProductManager } from "./productManager.js";

const app = express();
const PORT = 8080;
const PATH = "./src/products.json";
const productManager = new ProductManager(PATH);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Página inicial!");
});

app.get("/products", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts();
  products
    ? limit
      ? res.status(200).send(products.slice(0, limit))
      : res.status(200).send(products)
    : res.status(404).send("Sin productos registrados!");
});

app.get("/products/:id", async (req, res) => {
  const product = await productManager.getProductById(parseInt(req.params.id));
  product
    ? res.status(200).send(product)
    : res.status(404).send("Producto no encontrado - Error 404");
});

app.get("*", (req, res) => {
  res.status(404).send("Página no encontrada - Error 404");
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
