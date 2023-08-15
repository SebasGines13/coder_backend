import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

const UNICODE = "utf-8";

export class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
  }

  async addCart() {
    await this.loadFromFile();
    const cart = {
      id: uuidv4(),
      products: [],
    };
    this.carts.push(cart);
    await this.saveToFile();
    return cart;
  }

  async getCartById(cid) {
    await this.loadFromFile();
    return this.carts.find((cart) => cart.id === cid);
  }

  async addProduct(cid, pid) {
    await this.loadFromFile();
    const indiceCart = this.carts.findIndex((cart) => cart.id === cid);
    if (indiceCart != -1) {
      const indiceProduct = this.carts[indiceCart].products.findIndex(
        (product) => product.id === pid
      );
      if (indiceProduct != -1) {
        this.carts[indiceCart].products[indiceProduct].quantity++;
      } else {
        this.carts[indiceCart].products.push({
          id: pid,
          quantity: 1,
        });
      }
      await this.saveToFile();
      return this.carts[indiceCart];
    }
  }

  async loadFromFile() {
    try {
      const file = await fs.readFile(this.path, UNICODE);
      this.carts = JSON.parse(file);
    } catch (error) {
      this.carts = [];
    }
  }

  async saveToFile() {
    await fs.writeFile(this.path, JSON.stringify(this.carts));
  }
}
