import { promises as fs } from "fs";

const UNICODE = "utf-8";

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
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

  getProducts = async () => {
    const products = JSON.parse(await fs.readFile(this.path, UNICODE));
    console.log(products);
  };

  getProductById = async (id) => {
    const products = JSON.parse(await fs.readFile(this.path, UNICODE));
    const prod = products.find((producto) => producto.id === id);
    if (prod) {
      console.log(prod);
    } else {
      console.log("Producto id " + id + " no encontrado.");
    }
  };

  addProduct = async (product) => {
    //Consulto el txt y lo parseo
    const products = JSON.parse(await fs.readFile(this.path, UNICODE));
    //Consulto si mi producto ya existe en el txt
    if (products.find((producto) => producto.id === product.id)) {
      return "Producto ya agregado";
    }
    //Lo agrego al array al ya saber que no existe
    products.push(product);
    //Parsearlo y guardar el array modificado
    await fs.writeFile(this.path, JSON.stringify(products));
  };

  updateProduct = async (id, product) => {
    const products = JSON.parse(await fs.readFile(this.path, UNICODE));
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
    const products = JSON.parse(await fs.readFile(this.path, UNICODE));
    const prods = products.filter((prod) => prod.id != id);
    await fs.writeFile(this.path, JSON.stringify(prods));
  };
}

const productManager = new ProductManager("./productos.txt");

const product1 = {
  title: "Cafe la Morenita",
  description: "Cafe la Morenita en su empaque de 2kg.",
  price: 1998,
  thumbnail: "wwww.C1234.com",
  code: "C1234",
  stock: 100,
  id: ProductManager.nextId(),
};

const product2 = {
  title: "Yerba Playadito",
  description: "Yerba Playadito en su empaque de 1kg",
  price: 800,
  thumbnail: "wwww.Y1234.com",
  code: "Y1234",
  stock: 250,
  id: ProductManager.nextId(),
};

const product3 = {
  title: "Azucar",
  description: "Azucar en su empaque de 1kg",
  price: 450,
  thumbnail: "wwww.A332.com",
  code: "A332",
  stock: 500,
  id: ProductManager.nextId(),
};

const productUpdate = {
  title: "Yerba CBC2",
  description: "Yerba CBC2 en su empaque de 500gr",
  price: 752,
  thumbnail: "wwww.CBC.com",
  code: "YCBC",
  stock: 500,
};

await productManager.addProduct(product1);
await productManager.addProduct(product2);
await productManager.addProduct(product3);
await productManager.getProductById(1);
await productManager.getProductById(2);
await productManager.getProductById(3);
await productManager.getProductById(4);
await productManager.updateProduct(3, productUpdate);
await productManager.deleteProduct(1);
await productManager.getProducts();
