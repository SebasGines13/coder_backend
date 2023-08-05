import { promises as fs } from "fs";

const UNICODE = "utf-8";

export class ProductManager {
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

  async getProducts() {
    return JSON.parse(await fs.readFile(this.path, UNICODE));
  }

  async getProductById(id) {
    const products = JSON.parse(await fs.readFile(this.path, UNICODE));
    return products.find((producto) => producto.id === id);
  }

  async addProduct(product) {
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
  }

  async updateProduct(id, product) {
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
  }

  async deleteProduct(id) {
    const products = JSON.parse(await fs.readFile(this.path, UNICODE));
    const prods = products.filter((prod) => prod.id != id);
    await fs.writeFile(this.path, JSON.stringify(prods));
  }
}
