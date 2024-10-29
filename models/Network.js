const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const moment = require("moment-timezone");

const Network = sequelize.define(
  "Network",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fromReferenceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toReferenceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    networkStatus: {
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

module.exports = Network;
