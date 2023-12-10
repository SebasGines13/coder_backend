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
    let authToken; // Variable para guardar el token jwt.
    before(async () => {
      // Realiza una solicitud de inicio de sesión y obtengo el token de otra manera
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
    it("Test endpoint /api/sessions/login, se espera que loguee al nuevo usuario", async function () {
      const loggedUser = {
        email: "sebastian.gines@gmail.com",
        password: "Coderhouses",
      };
      const { ok, _body } = await requester
        .post("/api/sessions/login")
        .send(loggedUser)
        .expect(200);
      logger.info(ok);
      logger.info(JSON.stringify(_body));
    });
    it("Test endpoint /api/sessions/current, se espera error 401 ya que no se envia el token", async function () {
      const { _body } = await requester
        .get("/api/sessions/current")
        .expect(401);
      logger.info(JSON.stringify(_body));
    });
    it("Test endpoint /api/sessions/current, se espera que muestre los datos del usuario logueado actualmente", async function () {
      const { _body } = await requester
        .get("/api/sessions/current")
        .set("Cookie", `jwtCookie=${authToken}`)
        .expect(200);
      logger.info(JSON.stringify(_body));
    });

    it("Test endpoint /api/sessions/logout, se espera que muestre los datos del usuario logueado actualmente", async function () {
      const { _body } = await requester.get("/api/sessions/logout").expect(200);
      logger.info(JSON.stringify(_body));
    });
  });
});
