const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const moment = require("moment-timezone");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productType: {
      type: DataTypes.ENUM,
      values: ["SILVER", "GOLD"],
      allowNull: false,
    },
    productWeigth: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    productPrice: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    productTenure: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productStatus: {
      type: DataTypes.ENUM,
      values: ["PENDING", "ACCEPTED", "REJECTED"],
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate(instance, options) {
        instance.createdAt = moment().tz("Asia/Kolkata").format();
      },
      beforeUpdate(instance, options) {
        instance.updatedAt = moment().tz("Asia/Kolkata").format();
      },
    },
  }
);
module.exports = Product;
