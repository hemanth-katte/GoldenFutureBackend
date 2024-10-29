const express = require("express");
const userController = require("../controllers/UserController");
const adminController = require("../controllers/AdminController");
const productController = require("../controllers/ProductController");
// const networkController = require("../controllers/NetworkController");
// const accountController = require("../controllers/AccountController");

const router = express.Router();

router.use("/users", userController);
router.use("/admins", adminController);
router.use("/products", productController);
// router.use("/networks", networkController);
// router.use("/accounts", accountController);

module.exports = router;
