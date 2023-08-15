import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

const UNICODE = "utf-8";

export class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(prod) {
    await this.loadFromFile();
    if (
      !(
        this.products.some((p) => p.code === prod.code) ||
        !prod.title ||
        !prod.description ||
        !prod.price ||
        !prod.category ||
        !prod.code ||
        !prod.stock
      )
    ) {
      prod.status = prod.status || true;
      prod.id = uuidv4();
      this.products.push(prod);
      await this.saveToFile();
      return true;
    }
    return false;
  }

  async getProductById(id) {
    await this.loadFromFile();
    return this.products.find((producto) => producto.id === id);
  }

  async getProducts() {
    await this.loadFromFile();
    return this.products;
  }

  async updateProduct(id, product) {
    await this.loadFromFile();
    const indice = this.products.findIndex((prod) => prod.id === id);
    console.log(indice);
    console.log(this.products);

    if (indice != -1) {
      //Mediante el indice modifico todos los atributos de mi objeto
      this.products[indice] = product;
      this.products[indice].id = id;
      //Resto de los atributos presentes
      await this.saveToFile();
      return true;
    } else {
      return;
    }
  }

  async deleteProduct(id) {
    await this.loadFromFile();
    const preFilterCount = this.products.length;
    this.products = this.products.filter((prod) => prod.id != id);
    if (preFilterCount != this.products.length) {
      await this.saveToFile();
      return true;
    }
    return false;
  }

  async loadFromFile() {
    try {
      const file = await fs.readFile(this.path, UNICODE);
      this.products = JSON.parse(file);
    } catch (error) {
      this.products = [];
    }
  }

  async saveToFile() {
    await fs.writeFile(this.path, JSON.stringify(this.products));
  }
}
