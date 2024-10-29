const express = require("express");
const ProductService = require("../services/productService");
const router = express.Router();
const productService = new ProductService();
require("dotenv").config();

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createProduct(req, res) {
    try {
      const productData = req.body;
      const newProduct = await productService.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await productService.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const productData = req.body;
      const updatedProduct = await productService.updateProduct(
        productId,
        productData
      );
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      await productService.deleteProduct(productId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

const productController = new ProductController();

router.post(
  "/createProduct",
  productController.createProduct.bind(productController)
);
router.get(
  "/getAllProducts",
  productController.getAllProducts.bind(productController)
);
router.get(
  "/getProductById/:id",
  productController.getProductById.bind(productController)
);
router.put(
  "/updateProduct/:id",
  productController.updateProduct.bind(productController)
);
router.delete(
  "/deleteProduct/:id",
  productController.deleteProduct.bind(productController)
);

module.exports = router;
