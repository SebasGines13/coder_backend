import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import routerProd from "./routes/products.routes.js";
import cartProd from "./routes/carts.routes.js";
import { __dirname } from "./path.js";
import { ProductManager } from "./controllers/productManager.js";
import path from "path";

// Constantes
const PORT = 8080;
const HOME = "home";
const SOCKETGETPRODUCTS = "realTimeProducts";
const SOCKETADDPRODUCT = "newProduct";

const app = express();
const productManager = new ProductManager("src/models/products.json");

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
    await productManager.addProduct(prod);
    const products = await productManager.getProducts();
    io.emit("listProducts", products);
  });
});

//Routes
app.use("/static", express.static(path.join(__dirname, "/public"))); //path.join() es una concatenacion de una manera mas optima que con el +
app.use("/api/product", routerProd);
app.use("/api/cart", cartProd);

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
