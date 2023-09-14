import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import routerProd from "./routes/products.routes.js";
import cartProd from "./routes/carts.routes.js";
import messageProd from "./routes/messages.routes.js";
import mongoose from "mongoose";
import { __dirname } from "./path.js";
import productModel from "./models/products.models.js";
import messageModel from "./models/messages.models.js";
import path from "path";
import dotenv from "dotenv";

// Carga las variables de entorno desde .env
dotenv.config();

// Constantes
const PORT = 8080;
const HOME = "home";
const SOCKETGETPRODUCTS = "realTimeProducts";
const SOCKETADDPRODUCT = "newProduct";
const CHAT = "chat";

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("DB conectada");
  })

  .catch((error) => console.log("Error en conexión a MongoDB Atlas: ", error));

//Server
const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

const io = new Server(server);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //URL extensas
app.engine("handlebars", engine()); //Defino que voy a trabajar con hbs y guardo la config
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

//Conexion de Socket.io
io.on("connection", (socket) => {
  console.log("Conexión con socket.io");
  socket.on("addProduct", async (prod) => {
    await productModel.addProduct(prod);
    const products = await productModel.find();
    io.emit("listProducts", products);
  });
  socket.on("addMessage", async (info) => {
    const { email, message } = info;
    await messageModel.create({
      email,
      message,
    });
    const messages = await messageModel.find();
    io.emit("messages", messages);
  });
});

//Routes
app.use("/static", express.static(path.join(__dirname, "/public"))); //path.join() es una concatenacion de una manera mas optima que con el +
app.use("/api/products", routerProd);
app.use("/api/carts", cartProd);
app.use("/api/messages", messageProd);

//HBS
app.get("/static/" + HOME, async (req, res) => {
  const productos = await productManager.getProducts();
  res.render(HOME, {
    rutaCSS: HOME,
    productos: productos,
  });
});

app.get("/static/" + SOCKETGETPRODUCTS, async (req, res) => {
  const productos = await productManager.getProducts();
  res.render(SOCKETGETPRODUCTS, {
    rutaCSS: SOCKETGETPRODUCTS,
    rutaJS: SOCKETGETPRODUCTS,
    productos: productos,
  });
});

app.get("/static/" + SOCKETADDPRODUCT, async (req, res) => {
  res.render(SOCKETADDPRODUCT, {
    rutaCSS: SOCKETADDPRODUCT,
    rutaJS: SOCKETADDPRODUCT,
  });
});

app.get("/static/" + CHAT, (req, res) => {
  res.render(CHAT, {
    rutaCSS: CHAT,
    rutaJS: CHAT,
  });
});
