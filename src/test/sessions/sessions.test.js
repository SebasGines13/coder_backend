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

describe("Testing Aplicacion", () => {
  describe("Test de sessions", () => {
    it("Test endpoint /api/sessions/login, se espera que loguee al nuevo usuario", async function () {
      const loggedUser = {
        email: "sebastian.gines@gmail.com",
        password: "Coderhouses",
      };
      const { ok, _body } = await requester
        .post("/api/sessions/login")
        .send(loggedUser);
      logger.info(ok);
      logger.info(JSON.stringify(_body));
    });
    it("Test endpoint /api/sessions/current, se espera que muestre los datos del usuario logueado actualmente", async function () {
      const { _body } = await requester.get("/api/sessions/current");
      logger.info(JSON.stringify(_body));
    });
    it("Test endpoint /api/sessions/logout, se espera que muestre los datos del usuario logueado actualmente", async function () {
      const { _body } = await requester.get("/api/sessions/logout");
      logger.info(JSON.stringify(_body));
    });
  });
});
