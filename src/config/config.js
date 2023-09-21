import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Server } from "socket.io";
import express from "express";
import "dotenv/config";
import { __dirname } from "../path.js";
import path from "path";
import { engine } from "express-handlebars";

// Constantes
const PORT = 8080;

// App
export const app = express();

// Conexión a BD
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("DB conectada");
  })
  .catch((error) => console.log("Error en conexión a MongoDB Atlas: ", error));

// Server
const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
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
      mongoUrl: process.env.MONGO_URI,
      mongoOptions: { UseNewUrlParser: true, useUnifiedTopology: true },
      ttl: 5, // segundos
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);

export const io = new Server(server);
