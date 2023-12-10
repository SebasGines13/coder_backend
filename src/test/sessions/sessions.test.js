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
  describe("Test de usuarios", () => {
    it("Test endpoint /api/users/register, se espera que registre un nuevo usuario", async function () {
      const newUser = {
        first_name: "Nombre test",
        last_name: "Apellido test",
        email: "test@test",
        password: "1234ABdca12",
        age: 33,
      };
      const { ok, _body } = await requester
        .post("/api/users/register")
        .send(newUser); //requester.método('contenido o no')
      logger.info(ok);
      logger.info(JSON.stringify(_body));
    });
    it("Test endpoint /, se espera que loguee al nuevo usuario", async function () {
      const loggedUser = {
        email: "test@test",
        password: "1234ABdca12",
      };

      const { ok, _body } = await requester.post("/").send(loggedUser); //requester.método('contenido o no')
      logger.info(ok);
      logger.info(JSON.stringify(_body));
    });
    it("Test endpoint /current, se espera que muestre los datos del usuario logueado actualmente", async function () {
      const { _body } = await requester.get("/current");
      logger.info(JSON.stringify(_body));
    });
  });
});
