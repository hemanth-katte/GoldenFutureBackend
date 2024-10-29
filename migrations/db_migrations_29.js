const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
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
    });

    await queryInterface.createTable("Accounts", {
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
    });

    await queryInterface.createTable("Networks", {
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
    });

    await queryInterface.createTable("Products", {
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
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
