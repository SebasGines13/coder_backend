import { promises as fs } from "fs";

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  getProducts = async () => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    console.log(products);
  };

  getProductById = async (id) => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const prod = products.find((producto) => producto.id === id);
    if (prod) {
      console.log(prod);
    } else {
      console.log("Producto id " + id + " no encontrado.");
    }
  };

  addProduct = async (product) => {
    //Consulto el txt y lo parseo
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    //Consulto si mi producto ya existe en el txt
    if (products.find((producto) => producto.id == product.id)) {
      return "Producto ya agregado";
    }
    //Lo agrego al array al ya saber que no existe
    products.push(product);
    //Parsearlo y guardar el array modificado
    await fs.writeFile(this.path, JSON.stringify(products));
  };

  updateProduct = async (id, product) => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const indice = products.findIndex((prod) => prod.id === id);

    if (indice != -1) {
      //Mediante el indice modifico todos los atributos de mi objeto
      products[indice] = product;
      products[indice].id = id;
      //Resto de los atributos presentes
      await fs.writeFile(this.path, JSON.stringify(products));
    } else {
      console.log("Producto id " + id + " no encontrado.");
    }
  };

  deleteProduct = async (id) => {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const prods = products.filter((prod) => prod.id != id);
    await fs.writeFile(this.path, JSON.stringify(prods));
  };
}

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = Product.nextId();
  }

  // Método de clase
  static nextId() {
    if (this.idIncrement) {
      // Atributo de la clase.
      this.idIncrement++;
    } else {
      this.idIncrement = 1;
    }
    return this.idIncrement;
  }
}

class ProductUpdate {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

const product1 = new Product(
  "Cafe la Morenita",
  "Cafe la Morenita en su empaque de 2kg.",
  1998,
  "wwww.C1234.com",
  "C1234",
  100
);
const product2 = new Product(
  "Yerba Playadito",
  "Yerba Playadito en su empaque de 1kg",
  800,
  "wwww.Y1234.com",
  "Y1234",
  250
);

const productUpdate = new ProductUpdate(
  "Yerba CBC",
  "Yerba CBC en su empaque de 500gr",
  752,
  "wwww.CBC.com",
  "YCBC",
  500
);

const productManager = new ProductManager("./productos.txt");

//productManager.addProduct(product1);
//productManager.addProduct(product2);
//productManager.getProductById(1);
//productManager.getProductById(2);
//productManager.getProductById(3);
productManager.updateProduct(1, productUpdate);
//productManager.deleteProduct(1);
productManager.getProducts();
