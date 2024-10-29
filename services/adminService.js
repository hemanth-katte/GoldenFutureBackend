const AdminRepository = require("../repositories/adminRepository");
const UserRepository = require("../repositories/userRepository");
const AccountRepository = require("../repositories/accountRepository");
const NetworkRepository = require("../repositories/networkRepository");
const ProductRepository = require("../repositories/productRepository");
const Network = require("../models/Network");
const Account = require("../models/Account");
const shortid = require("shortid");
const { sendInvoiceEmail } = require("../EmailInvoice/invoice");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");
const { errors } = require("pg-promise");
const excel = require("exceljs");

class AdminService {
  constructor() {
    this.adminRepository = new AdminRepository();
    this.userRepository = new UserRepository();
    this.accountRepository = new AccountRepository();
    this.networkRepository = new NetworkRepository();
    this.productRepository = new ProductRepository();
  }

  async getAdminByPhone(phone, password) {
    return await this.adminRepository.getAdminByPhone(phone, password);
  }

  async getAllUsersByStatus(status) {
    return this.userRepository.getAllUsersByStatus(status);
  }

  async updateUsersStatusByID(id, status) {
    try {
      const user1 = await this.userRepository.getUserById(id);
      if (!user1.emailVerified && status == "ACCEPTED") {
        return null;
      }
      var referenceId = shortid.generate();
      var user = await this.userRepository.setUserSponsorId(id, referenceId);
      const userEmail = user.email;
      //var flag = false;
      const product = await this.productRepository.getProductById(user.toJSON().productId);
      if (user.toJSON().sponsorId !== null && user.toJSON().sponsorId.trim() !== "" && user.toJSON().status != "ACCEPTED" && status == "ACCEPTED") {
        var sponsorId = user.toJSON().sponsorId.trim();

        const productPrice = product.toJSON().productPrice;
        var networkData;
        var network;
        var accountData;
        var account;
        var networkIds = [];
        var accountIds = [];
        for (var i = 1; i <= 3; i++) {
          if (sponsorId != null && sponsorId != "") {
            user = await this.userRepository.getUserBySponsorId(sponsorId);

            networkData = Network.build({
              fromReferenceId: referenceId,
              toReferenceId: sponsorId,
              level: i,
              networkStatus: status,
            });
            network = await this.networkRepository.createNetwork(networkData.toJSON());
            networkIds.push(network.id);

            const commitionAmount = ({ 1: 10, 2: 5, 3: 2 }[i] / 100) * productPrice;
            var balance = parseFloat(user.toJSON().totalBalance) + parseFloat(commitionAmount);
            accountData = Account.build({
              userId: user.toJSON().id,
              networkId: network.id,
              amount: parseFloat(commitionAmount),
              transferType: "CREDIT",
              balance: balance,
              accountStatus: status,
            });
            account = await this.accountRepository.createAccount(accountData.toJSON());
            accountIds.push(account.id);
            await this.userRepository.setUserBalance(user.toJSON().id, balance);
            await this.userRepository.setUserNetworkLevelCount(user.toJSON().id, i);
            sponsorId = user.toJSON().sponsorId === null || user.toJSON().sponsorId.trim() === "" ? null : user.toJSON().sponsorId.trim();
          } else {
            break;
          }
        }
      }
      if (status == "ACCEPTED") {
        this.sendInvoiceToUser(product, userEmail);
      }
      return this.userRepository.setUserStatus(id, status);
    } catch (error) {
      accountIds.forEach((id) => {
        this.accountRepository.deleteAccount(id);
      });

      networkIds.forEach((id) => {
        this.networkRepository.deleteNetwork(id);
      });

      throw error;
    }
  }

  async getAllPaymentsByStatus(status) {
    const accounts = await this.accountRepository.getAllPaymentsByStatus(status);

    const transformedAccounts = await Promise.all(
      accounts.map(async (account) => {
        const user = await this.userRepository.getUserById(account.userId);

        return {
          accountId: account.id,
          referenceId: user.referenceId,
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
          address: user.address,
          userUPI: user.userUPI,
          createdAt: account.createdAt,
          amount: account.amount,
          balance: account.balance,
        };
      })
    );
    const jsonResult = JSON.stringify(transformedAccounts);
    const accountData = JSON.parse(jsonResult);
    return accountData;
  }

  async updatePaymentsStatusByID(userId, id, status) {
    return await this.accountRepository.updatePaymentsStatusByID(userId, id, status);
  }

  async sendInvoiceToUser(product, userEmail) {
    const emailConfig = {
      senderEmail: "goldenfuturepvtltd@gmail.com",
      senderPassword: "qgnb spwn nhud iigu",
      from: "goldenfuturepvtltd@gmail.com",
      to: userEmail,
      subject: "Golden Future - E-Invoice for Purchase",
      text: "Congratulations on your Recent Purchase. Here is your E-Invoice:",
      template: "email",
      attachments: [
        {
          filename: "invoice.pdf",
          path: `Invoice.pdf`,
        },
      ],
    };

    const productData = this.getProductData(product);

    const invoiceData = {
      created_date: this.getFormattedDate(),
      productName: productData.productName,
      productPrice: productData.productPrice,
      CGST: productData.product_CGST,
      IGST: productData.product_IGST,
      SubTotal1: productData.subTotal1,
      membershipPrice: productData.membershipPrice,
      CGST2: productData.membership_CGST,
      IGST2: productData.membership_IGST,
      SubTotal2: productData.subTotal2,
      grandTotal: productData.grandTotal,
    };

    await sendInvoiceEmail(emailConfig, invoiceData);
  }

  getProductData(product) {
    if (product.id == 1) {
      return {
        productName: product.productName,
        productPrice: 485,
        product_CGST: 7.5,
        product_IGST: 7.5,
        subTotal1: 500,
        membershipPrice: 409,
        membership_CGST: 44.91,
        membership_IGST: 44.91,
        subTotal2: 499,
        grandTotal: 999,
      };
    } else if (product.id == 2) {
      return {
        productName: product.productName,
        productPrice: 1455,
        product_CGST: 22.5,
        product_IGST: 22.5,
        subTotal: 1500,
        membershipPrice: 1455,
        membership_CGST: 59.96,
        membership_IGST: 59.96,
        subTotal2: 1499,
        grandTotal: 2999,
      };
    } else if (product.id == 3) {
      return {
        productName: product.productName,
        productPrice: 2425,
        product_CGST: 37.5,
        product_IGST: 37.5,
        subTotal: 2500,
        membershipPrice: 2049,
        membership_CGST: 224.91,
        membership_IGST: 224.91,
        subTotal2: 2499,
        grandTotal: 4999,
      };
    } else {
      return {
        productName: product.productName,
        productPrice: 5820,
        product_CGST: 90,
        product_IGST: 90,
        subTotal1: 6000,
        membershipPrice: 4919.98,
        membership_CGST: 540.41,
        membership_IGST: 540.41,
        subTotal2: 5999,
        grandTotal: 11999,
      };
    }
  }

  getFormattedDate() {
    const currentTimestamp = Date.now();
    const date = new Date(currentTimestamp);
    return date.toISOString();
  }

  async getDataByDate(fromDate, toDate) {
    return await this.userRepository.findByDate(fromDate, toDate);
  }

  async generateExcelData(data) {
    if (!Array.isArray(data) || data.length === 0 || !data[0].hasOwnProperty("dataValues")) {
      throw new Error("Invalid data format");
    }
    const columnHeaders = Object.keys(data[0].dataValues);
    const filteredColumnHeaders = columnHeaders.filter((key) => key !== "password");
    const columnHeadersConfig = filteredColumnHeaders.map((key) => ({
      header: key,
      key,
      width: 20,
    }));

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Data");
    worksheet.columns = columnHeadersConfig;

    data.forEach((row) => {
      const rowData = {};
      for (const key of filteredColumnHeaders) {
        rowData[key] = row[key];
      }
      worksheet.addRow(rowData);
    });

    return workbook.xlsx.writeBuffer();
  }
}

module.exports = AdminService;
