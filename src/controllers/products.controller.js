import productModel from "../models/products.models.js";
import { generateProduct } from "../utils/utils.js";
import CustomError from "../services/errors/customError.js";
import EErrors from "../services/errors/enums.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import logger from "../utils/logger.js";

const getProducts = async (req, res) => {
  const { limit, page, sort, filter } = req.query;

  const pag = page ? page : 1;
  const lim = limit ? limit : 6;
  const ord = sort === "asc" ? 1 : -1; // Cambié 0 a -1 para orden descendente

  try {
    const query = filter
      ? {
          $or: [
            { title: { $regex: new RegExp(filter, "i") } },
            { description: { $regex: new RegExp(filter, "i") } },
          ],
        }
      : {};
    const products = await productModel.paginate(query, {
      limit: lim,
      page: pag,
      sort: { price: ord },
    });

    if (products) {
      return res.status(200).send(products);
    }
    logger.error("Productos no encontrados");
    res.status(404).send({ error: "Productos no encontrados" });
  } catch (error) {
    logger.error(`Error en consultar productos ${error}`);
    res.status(500).send({ error: `Error en consultar productos ${error}` });
  }
};

const getProduct = async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await productModel.findById(pid);

    if (product) {
      return res.status(200).send(product);
    }
    logger.error("Producto no encontrado");
    res.status(404).send({ error: "Producto no encontrado" });
  } catch (error) {
    logger.error(`Error en consultar producto ${error}`);
    res.status(500).send({ error: `Error en consultar producto ${error}` });
  }
};

const postProduct = async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    CustomError.createError({
      name: "Product creation error",
      cause: generateProductErrorInfo({
        title,
        description,
        code,
        price,
        stock,
        category,
      }),
      message: "Error trying to create Product",
      code: EErrors.MISSING_REQUIRED_FIELDS.INVALID_TYPES_ERROR,
    });
  }

  try {
    const product = await productModel.create({
      title,
      description,
      code,
      price,
      stock,
      category,
    });

    if (product) {
      return res.status(201).send(product);
    }
  } catch (error) {
    if (error.code == 11000) {
      logger.error("Llave duplicada");
      return res.status(400).send({ error: `Llave duplicada` });
    }
    logger.error(`Error en consultar producto ${error}`);
    return res
      .status(500)
      .send({ error: `Error en consultar producto ${error}` });
  }
};

const putProduct = async (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, stock, category } = req.body;

  try {
    const product = await productModel.findByIdAndUpdate(pid, {
      title,
      description,
      code,
      price,
      stock,
      category,
    });

    if (product) {
      return res.status(200).send(product);
    }
    logger.error("Producto no encontrado");
    res.status(404).send({ error: "Producto no encontrado" });
  } catch (error) {
    logger.error(`Error en actualizar producto ${error}`);
    res.status(500).send({ error: `Error en actualizar producto ${error}` });
  }
};

const deleteProduct = async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await productModel.findByIdAndDelete(pid);
    if (product) {
      return res.status(200).send(product);
    }
    logger.error("Producto no encontrado");
    res.status(404).send({ error: "Producto no encontrado" });
  } catch (error) {
    logger.error(`Error en actualizar producto ${error}`);
    res.status(500).send({ error: `Error en actualizar producto ${error}` });
  }
};

const getMockingProducts = async (req, res) => {
  try {
    const { cantProducts } = req.params;
    const products = [];
    for (let i = 0; i < cantProducts; i++) {
      products.push(generateProduct());
    }

    if (products.length > 0) {
      return res.status(200).send(products);
    }
    logger.error("Productos no encontrados");
    res.status(404).send({ error: "Productos no encontrados" });
  } catch (error) {
    logger.error(`Error en consultar productos ${error}`);
    res.status(500).send({ error: `Error en consultar productos ${error}` });
  }
};

const productsController = {
  getProducts,
  getProduct,
  postProduct,
  putProduct,
  deleteProduct,
  getMockingProducts,
};

export default productsController;
