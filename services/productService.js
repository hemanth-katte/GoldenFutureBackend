const ProductRepository = require('../repositories/productRepository');

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts() {
    return this.productRepository.getAllProducts();
  }

  async createProduct(productData) {
    return this.productRepository.createProduct(productData);
  }

  async getProductById(productId) {
    return this.productRepository.getProductById(productId);
  }

  async updateProduct(productId, productData) {
    return this.productRepository.updateProduct(productId, productData);
  }

  async deleteProduct(productId) {
    return this.productRepository.deleteProduct(productId);
  }
}

module.exports = ProductService;
