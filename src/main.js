import express from "express";
import staticRouter from "./routes/static.routes.js";
import { __dirname } from "./path.js";
import path from "path";
import productModel from "./models/products.models.js";
import messageModel from "./models/messages.models.js";
import { app, io } from "./config/config.js";
import usersRouter from "./routes/users.routes.js";
import router from "./routes/index.routes.js";

// Conexion de Socket.io
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

// Routes
app.use(
  "/static/",
  staticRouter,
  express.static(path.join(__dirname, "/public"))
);
app.use("/", usersRouter, express.static(__dirname + "/public"));
app.use("/", router);
