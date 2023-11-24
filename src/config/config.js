import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Server } from "socket.io";
import express from "express";
import "dotenv/config";
import { __dirname } from "../path.js";
import path from "path";
import { engine } from "express-handlebars";
import initializePassport from "./passport.js";
import passport from "passport";
import errorHandler from "../middlewares/errors/index.js";
import logger from "../utils/logger.js";
import swaggerJSDoc from "swagger-jsdoc";

// Constantes
const PORT = process.env.PORT || 8080;

// App
export const app = express();

// Conexión a BD
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    logger.info("DB conectada");
  })
  .catch((error) => logger.error("Error en conexión a MongoDB Atlas: ", error));

// Server
const server = app.listen(PORT, () => {
  logger.info(`Server on port ${PORT}`);
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //URL extensas
app.engine("handlebars", engine()); //Defino que voy a trabajar con hbs y guardo la config
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: { UseNewUrlParser: true, useUnifiedTopology: true },
      ttl: 5, // segundos
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(errorHandler);

// Config Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Documentación del curso de BackEnd",
      description: "API Coderhouse BackEnd",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

// ** significa cualquier subcarpeta
// *  significa cualquier nombre de archivo

export const specs = swaggerJSDoc(swaggerOptions);

export const io = new Server(server);
