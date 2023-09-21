import express from "express";
import routerProd from "./routes/products.routes.js";
import cartProd from "./routes/carts.routes.js";
import staticRouter from "./routes/static.routes.js";
import sessionRouter from "./routes/session.routes.js";
import messageProd from "./routes/messages.routes.js";
import { __dirname } from "./path.js";
import path from "path";
import productModel from "./models/products.models.js";
import messageModel from "./models/messages.models.js";
import { app, io } from "./config/config.js";
import viewsRouter from "./routes/views.routes.js";

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
app.use("/api/products", routerProd);
app.use("/api/carts", cartProd);
app.use("/api/messages", messageProd);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter, express.static(__dirname + "/public"));
