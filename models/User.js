const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    referenceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sponsorId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aadhar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userUPI: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentScreenshot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentTransactionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shipmentType: {
      type: DataTypes.ENUM,
      values: ["TAKEAWAY", "COURIERDELIVARY"],
      allowNull: false,
    },
    totalBalance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    firstLevelCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    secondLevelCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    thirdLevelCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["PENDING", "ACCEPTED", "REJECTED"],
      allowNull: false,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
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

User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.associate = (models) => {
  User.hasMany(models.Account, { foreignKey: "userId" });
};

module.exports = User;
