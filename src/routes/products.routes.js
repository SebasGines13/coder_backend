import { Router } from "express";
import productModel from "../models/products.models.js";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const { limit, page, sort, category, status } = req.query;
  let sortOption;
  sort == "asc" && (sortOption = "price");
  sort == "desc" && (sortOption = "-price");

  const options = {
    limit: limit || 10,
    page: page || 1,
    sort: sortOption || null,
  };

  const query = {};
  category && (query.category = category);
  status && (query.status = status);

  try {
    const prods = await productModel.paginate(query, options);
    const response = {
      status: "success",
      payload: prods.docs,
      totalPages: prods.totalPages,
      prevPage: prods.prevPage,
      nextPage: prods.nextPage,
      page: prods.page,
      hasPrevPage: prods.hasPrevPage,
      hasNextPage: prods.hasNextPage,
      prevLink: prods.hasPrevPage
        ? `/api/products?page=${prods.prevPage}`
        : null,
      nextLink: prods.hasNextPage
        ? `/api/products?page=${prods.nextPage}`
        : null,
    };
    res.status(200).send({ resultado: "OK", message: response });
  } catch (error) {
    res.status(400).send({ error: `Error al consultar productos: ${error}` });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const prod = await productModel.findById(id);
    if (prod) res.status(200).send({ resultado: "OK", message: prod });
    else res.status(404).send({ resultado: "Not found", message: prod });
  } catch (error) {
    res.status(400).send({ error: `Error al consultar producto: ${error}` });
  }
});

productRouter.post("/", async (req, res) => {
  const { title, description, stock, code, price, category } = req.body;
  try {
    const { respuesta } = await productModel.create({
      title,
      description,
      stock,
      code,
      price,
      category,
    });
    res.status(200).send({ resultado: "OK", message: respuesta });
  } catch (error) {
    res.status(400).send({ error: `Error al consultar producto: ${error}` });
  }
});

productRouter.put("/:id", async (req, res) => {
  const { title, description, stock, code, price, category, status } = req.body;
  const { id } = req.params;
  try {
    const respuesta = await productModel.findByIdAndUpdate(id, {
      title,
      description,
      stock,
      code,
      price,
      category,
      status,
    });
    if (respuesta)
      res.status(200).send({ resultado: "OK", message: respuesta });
    else res.status(404).send({ resultado: "Not found", message: respuesta });
  } catch (error) {
    res.status(400).send({ error: `Error al actualizar producto: ${error}` });
  }
});

productRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const respuesta = await productModel.findByIdAndDelete(id);
    if (respuesta)
      res.status(200).send({ resultado: "OK", message: respuesta });
    else res.status(404).send({ resultado: "Not found", message: respuesta });
  } catch (error) {
    res.status(400).send({ error: `Error al eliminar producto: ${error}` });
  }
});

export default productRouter;
