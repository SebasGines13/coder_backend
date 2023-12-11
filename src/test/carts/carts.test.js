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

describe("Testing Aplicacion de Ecommerce", () => {
  describe("Test de carrito", () => {
    let idCart = "6575f3e3df5648bea3f9172d";
    let idProduct;
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
    it("Test endpoint /api/carts/:cid/product/:pid, se espera que agregue un producto", async function () {
      const { ok, _body } = await requester
        .put(`/api/carts/${idCart}/product/${idProduct}`)
        .set("Cookie", `jwtCookie=${authToken}`);
      logger.info(ok);
      logger.info(JSON.stringify(_body));
    });

    it("Test endpoint /api/carts, se espera que muestre todos los productos del carrito", async function () {
      const { _body } = await requester.get(`/api/carts/${idCart}`);
      logger.info(JSON.stringify(_body));
    });
    it("Test endpoint /api/carts/:cid/products/:pid, se espera que agregue un producto o actualice la cantidad del mismo en el carrito", async function () {
      const updateCart = {
        quantity: 1,
      };
      const { ok, _body } = await requester
        .put(`/api/carts/${idCart}/products/${idProduct}`)
        .set("Cookie", `jwtCookie=${authToken}`)
        .send(updateCart);
      logger.info(ok);
      logger.info(JSON.stringify(_body));
    });
    it("Test endpoint /api/carts/:cid/products/:pid, se espera que elimine un producto del carrito", async function () {
      const { _body } = await requester
        .delete(`/api/carts/${idCart}/products/${idProduct}`)
        .set("Cookie", `jwtCookie=${authToken}`);
      logger.info(JSON.stringify(_body));
    });
    it("Test endpoint /api/carts/:cid, se espera que elimine todos los productos del carrito", async function () {
      const { _body } = await requester
        .delete(`/api/carts/${idCart}`)
        .set("Cookie", `jwtCookie=${authToken}`);
      logger.info(JSON.stringify(_body));
    });
    it("Test endpoint /api/products/:pid, se espera que elimine un producto creado para el test", async function () {
      const { _body } = await requester
        .delete(`/api/products/${idProduct}`)
        .set("Cookie", `jwtCookie=${authToken}`)
        .expect(200);
      logger.info(JSON.stringify(_body));
    });
  });
});
