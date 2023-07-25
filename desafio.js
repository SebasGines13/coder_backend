class ProductManager {
  constructor() {
    this.products = [];
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    let product = this.products.find((p) => p.id == id);

    if (product) {
      return product;
    }
    return "Not found";
  }

  addProduct(product) {
    if (this.products.find((p) => p.code == product.code)) {
      return "Producto ya existente";
    }

    if (
      product.title != "" ||
      product.description != "" ||
      product.price > 0 ||
      product.thumbnail != "" ||
      product.code != "" ||
      product.stock > 0
    ) {
      this.products.push(product);
    } else {
      return "Debe ingresar valores en todos los campos!";
    }
  }
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

const productManager = new ProductManager();

productManager.addProduct(product1);
productManager.addProduct(product2);

console.log(productManager.getProducts());
