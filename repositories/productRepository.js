const Product = require("../models/Product");

class ProductRepository {
  async getAllProducts() {
    return Product.findAll();
  }

  async createProduct(productData) {
    return await Product.create(productData);
  }

  async getProductById(productId) {
    return await Product.findByPk(productId);
  }

  async updateProduct(productId, productData) {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return product.update(productData);
  }

  async deleteProduct(productId) {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return product.destroy();
  }
}

module.exports = ProductRepository;
