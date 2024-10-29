const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const moment = require("moment-timezone");

const Account = sequelize.define(
  "Account",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    networkId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    transferType: {
      type: DataTypes.ENUM,
      values: ["DEBIT", "CREDIT"],
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    accountStatus: {
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
Account.associate = (models) => {
  Account.belongsTo(models.User, { foreignKey: "userId" });
};

module.exports = Account;
