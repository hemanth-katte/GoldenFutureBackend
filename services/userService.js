const UserRepository = require("../repositories/userRepository");
const AccountRepository = require("../repositories/accountRepository");
const NetworkRepository = require("../repositories/networkRepository");
const ProductRepository = require("../repositories/productRepository");
const Account = require("../models/Account");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
var nodemailer = require("nodemailer");
require("dotenv").config();
const bcrypt = require("bcrypt");

var sessionOtp;
function generateOTP() {
  const randomNumber = Math.floor(Math.random() * 10000);
  const otp = randomNumber.toString().padStart(4, "0");
  return otp;
}

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.accountRepository = new AccountRepository();
    this.networkRepository = new NetworkRepository();
    this.productRepository = new ProductRepository();
  }

  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  async createUser(userData) {
    return this.userRepository.createUser(userData);
  }

  async getUserById(userId) {
    var user = await this.userRepository.getUserById(userId);
    if (user !== null) {
      user.password = null;
      return user;
    }
    return null;
  }

  async getUserByEmail(email) {
    return this.userRepository.getUserByEmail(email);
  }

  async getUserByPhone(phone) {
    return await this.userRepository.getUserByPhone(phone);
  }

  async updateUser(userId, userData) {
    return this.userRepository.updateUser(userId, userData);
  }

  async deleteUser(userId) {
    return this.userRepository.deleteUser(userId);
  }

  async getUserBalance(userId) {
    return this.userRepository.getUserBalance(userId);
  }

  async getMyTranscationRecords(userId) {
    return this.accountRepository.getMyTranscationRecords(userId, "DEBIT");
  }

  async userWithdDrawAmount(userId, userAmount) {
    const balance = await this.userRepository.getUserBalance(userId);
    const accountData = Account.build({
      userId: userId,
      networkId: null,
      amount: userAmount,
      transferType: "DEBIT",
      balance: parseFloat(balance),
      accountStatus: "PENDING",
    });
    return this.accountRepository.userWithdDrawAmount(accountData.toJSON());
  }

  async getMyNetworkConnectionBaseLevel(userId, networkLevel) {
    const user = await this.userRepository.getUserById(userId);
    const networkConnections = await this.networkRepository.getMyNetworkConnectionBaseLevel(user.referenceId, networkLevel);

    const transformedConnections = await Promise.all(
      networkConnections.map(async (connection) => {
        const u = await this.userRepository.getUserBySponsorId(connection.fromReferenceId);

        const product = await this.productRepository.getProductById(u.productId);

        return {
          date: connection.createdAt,
          name: `${u.firstname} ${u.lastname}`,
          plan: product ? product.productName : "",
          referenceId: u.referenceId,
        };
      })
    );

    const jsonResult = JSON.stringify(transformedConnections);

    const networkData = JSON.parse(jsonResult);

    return networkData;
  }

  async addNewUser(userData) {
    userData.referenceId = null;
    userData.totalBalance = 0;
    userData.firstLevelCount = 0;
    userData.secondLevelCount = 0;
    userData.thirdLevelCount = 0;
    userData.status = "PENDING";
    userData.verified = "PENDING";
    userData.sponsorId = userData.sponsorId.trim() === null || userData.sponsorId.trim() === "" ? null : userData.sponsorId.trim();
  }

  async signUpUser(userData, filePath) {
    try {
      var isExisting = await this.userRepository.verifyUser(userData);
      if (isExisting) {
        return null;
      }
      if (userData.sponsorId !== null && userData.sponsorId !== "") {
        var isSponsorerExisting = await this.userRepository.getUserBySponsorId(userData.sponsorId);
        if (isSponsorerExisting == null) {
          throw new Error("Sponsor Id is incorrect please enter correct sponsor Id or keep it blank");
        }
      }
      userData.referenceId = null;
      userData.totalBalance = 0;
      userData.firstLevelCount = 0;
      userData.secondLevelCount = 0;
      userData.thirdLevelCount = 0;
      userData.status = "PENDING";
      userData.emailVerified = false;
      userData.sponsorId = userData.sponsorId.trim() === null || userData.sponsorId.trim() === "" ? null : userData.sponsorId.trim();
      userData.paymentScreenshot = filePath;
      const user = await this.userRepository.createUser(userData);
      this.sendOTP(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async sendOTP(userData) {
    const otpCode = generateOTP();

    // Sending the OTP via email
    if (userData !== null && userData.email.trim() !== "") {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_APP_PASSWORD,
          },
        });

        const otpMessage = `<b>Important:</b> Please do not share this OTP with anyone. It is meant for your use only. 
                            <br><br>Your OTP is <h2>${otpCode}</h2> Thank you for your interest in Golden Future!<br><br>`;

        const Registration = {
          from: process.env.ADMIN_EMAIL,
          to: userData.email,
          subject: "Golden Future - OTP",
          html: otpMessage,
        };

        const info = await transporter.sendMail(Registration);

        if (info.accepted.length === 1) {
          this.sessionOtp = otpCode;
          return "OTP Successfully sent";
        }
      } catch (error) {
        throw new Error(error);
      }
    }

    return null;
  }

  async verifyEmail(userData) {
    var email = userData.email;
    var otp = userData.otp;
    //var sessionOtp = req.session.otp;
    const user = await this.userRepository.getUserByEmail(email);
    if (this.sessionOtp.trim() === otp.trim() && user.email.trim() !== null) {
      await this.userRepository.setEmailVerified(user.toJSON().id, true);
      return true;
    }
    return false;
  }

  async forgotPasswordSendOTP(userData) {
    var email = userData.email;
    var user = this.userRepository.getUserByEmail(email);
    if (user === null) {
      throw new Error("User email is incorrect please enter correct mail id");
    }
    return this.sendOTP(userData);
  }

  async forgotPasswordSetPassword(userData) {
    var email = userData.email;
    var user = await this.userRepository.getUserByEmail(email);
    if (user == null) {
      throw new Error("User email is incorrect please enter correct mail id");
    }
    var otp = userData.otp;
    if (this.sessionOtp === otp.trim()) {
      userData.password = await bcrypt.hash(userData.password, 10);
      return await this.userRepository.updateAndSaveUser(user.id, userData.password);
    }
    throw new Error("Please enter correct OTP");
  }
}

module.exports = UserService;
