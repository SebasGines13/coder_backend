import "dotenv/config";
import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import logger from "../../utils/logger.js";

const expect = chai.expect;
const requester = supertest("http://localhost:" + process.env.PORT);

await mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    logger.info(`[${new Date().toLocaleString()}]: DB conectada`);
  })
  .catch((error) => logger.error("Error en conexion con MongoDB: ", error));

let idProduct;

describe("Testing Aplicacion de Ecommerce", () => {
  describe("Test de productos", () => {
    let authToken; // Variable para guardar el token jwt.
    before(async () => {
      // Realiza una solicitud de inicio de sesión y obtengo el token
      const loggedUser = {
        email: process.env.USUARIO_TEST,
        password: process.env.PASS_TEST,
      };

      try {
        const response = await requester
          .post("/api/sessions/login")
          .send(loggedUser);
        authToken = response.headers["set-cookie"][0]
          .split(";")[0]
          .split("=")[1]; // Almacena el token para usarlo en las pruebas
      } catch (error) {
        logger.error("Error en la solicitud de inicio de sesión: ", error);
        throw error;
      }
    });
    it("Test endpoint /api/products, se espera que muestre todos los productos", async function () {
      const { _body } = await requester.get("/api/products").expect(200);
      logger.info(JSON.stringify(_body));
    });

    it("Test endpoint /api/products, se espera poder crear un producto", async function () {
      const newProduct = {
        title: "Tomates",
        description: "Tomates frescos, paquete de 20 unidades",
        code: "212312asdfc",
        price: 184,
        status: "true",
        stock: 500,
        category: "Frutas y verduras",
        thumbnails: [],
      };

      const { _body } = await requester
        .post("/api/products")
        .set("Cookie", `jwtCookie=${authToken}`)
        .send(newProduct)
        .expect(201);
      logger.info(JSON.stringify(_body));
      idProduct = _body._id;
    });

    it("Test endpoint /api/products, se espera se presente error 400 por llave duplicada", async function () {
      const newProduct = {
        title: "Tomates",
        description: "Tomates frescos, paquete de 20 unidades",
        code: "212312asdfc",
        price: 184,
        status: "true",
        stock: 500,
        category: "Frutas y verduras",
        thumbnails: [],
      };

      const { _body } = await requester
        .post("/api/products")
        .set("Cookie", `jwtCookie=${authToken}`)
        .send(newProduct)
        .expect(400);
      logger.info(JSON.stringify(_body));
    });

    it("Test endpoint /api/products/:pid, se espera que muestre un producto", async function () {
      const { _body } = await requester
        .get(`/api/products/${idProduct}`)
        .expect(200);
      logger.info(JSON.stringify(_body));
    });
    it("Test endpoint /api/products/:pid, se espera que actualice un producto", async function () {
      logger.info(idProduct);
      const updateProduct = {
        title: "base algo",
        price: "418",
        stock: "10",
      };
      const { ok, _body } = await requester
        .put(`/api/products/${idProduct}`)
        .set("Cookie", `jwtCookie=${authToken}`)
        .send(updateProduct)
        .expect(200);
      logger.info(ok);
      logger.info(JSON.stringify(_body));
    });
    it("Test endpoint /api/products/:pid, se espera que elimine un producto", async function () {
      const { _body } = await requester
        .delete(`/api/products/${idProduct}`)
        .set("Cookie", `jwtCookie=${authToken}`)
        .expect(200);
      logger.info(JSON.stringify(_body));
    });
  });
});
