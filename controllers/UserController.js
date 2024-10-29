const express = require("express");
const UserService = require("../services/userService");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();
const userService = new UserService();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
const { validationResult } = require("express-validator");
const upload = require("../middleware/uploadMiddleware");
const e = require("express");
const { captureRejectionSymbol } = require("nodemailer/lib/xoauth2");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

class UserController {
  async userlogin(req, res) {
    const { phonenumber, password } = req.body;
    const user = await userService.getUserByPhone(phonenumber);
    if (user !== null && !user.emailVerified) {
      await userService.sendOTP(user);
      return res.status(200).json({
        message: "OTP not verified, please verify in next step",
        emailVerified: false,
        email: user.email,
      });
    }
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const jwtToken = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: "12h", // Token expires in 12 hour
    });
    if (user && (user.status === "PENDING" || user.status === "REJECTED")) {
      return res.status(200).json({ message: "Admin has not verifed, please wait or contact admin", adminVerified: false, userStatus: user.status });
    }
    res.json({
      token: jwtToken,
      userId: user.id,
      email: user.email,
      username: user.firstname,
      emailVerified: true,
      adminVerified: true,
    });
  }

  async userSignup(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }
      const file = req.file;
      const filePath = file.path;
      console.log("==============================================");
      console.log(filePath);
      console.log("==============================================");
      const user = await userService.signUpUser(req.body, filePath);
      if (user == null) {
        return res.status(200).json({ message: "User already exists, please login", userData: null });
      }
      return res.status(201).json({ message: "Signup successful, please verify email", userData: user });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errorMessage: error.message });
    }
  }

  async sendVerificationOTP(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await userService.sendOTP(req.body);
      return res.status(200).json({ message: "Signup OTP sent successfully" });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }

  async verifyEmail(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      var result = await userService.verifyEmail(req.body);
      if (result == true) {
        return res.status(200).json({ message: "Email successfully verified", success: true });
      }
      return res.status(200).json({ message: "Please enter correct OTP", success: false });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }

  async forgotPasswordSendOTP(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await userService.forgotPasswordSendOTP(req.body);
      return res.status(200).json({ message: "OTP successfully sent to email" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async forgotPasswordSetPassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await userService.forgotPasswordSetPassword(req.body);
      return res.status(200).json({
        message: "Password is successfully reset, please login once again",
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // async userSignupSendingOTP(req, res) {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(422).json({ errors: errors.array() });
  //   }
  //   try {
  //     const otpCode = await userService.userSignupSendingOTP(req.body);
  //     req.body.session.otp = otpCode;
  //     return res
  //       .status(200)
  //       .json({ message: "Signup OTP send successful" });
  //   } catch (error) {
  //     console.error(error);
  //     return res.json({ error: error });
  //   }
  // }

  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User details fetched", userData: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserBalance(req, res) {
    try {
      const userId = req.params.id;
      const balance = await userService.getUserBalance(userId);
      res.status(200).json({ balance: balance });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMyTranscationRecords(req, res) {
    try {
      const userId = req.params.id;
      const transcation = await userService.getMyTranscationRecords(userId);
      res.status(200).json({ accountData: transcation });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async userWithdDrawAmount(req, res) {
    try {
      const userId = req.body.id;
      const userAmount = req.body.amount;
      const transcation = await userService.userWithdDrawAmount(userId, userAmount);
      res.status(200).json({ message: "Withdraw request successfully created", transaction: transcation });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMyNetworkConnectionBaseLevel(req, res) {
    try {
      const userId = req.query.id;
      const networkLevel = req.query.networkLevel;
      const transcation = await userService.getMyNetworkConnectionBaseLevel(userId, networkLevel);
      res.status(200).json({ networkItems: transcation });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // async getAllUsers(req, res) {
  //   try {
  //     const users = await userService.getAllUsers();
  //     res.json(users);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // }

  // async createUser(req, res) {
  //   try {
  //     const userData = req.body;
  //     const newUser = await userService.createUser(userData);
  //     res.status(201).json(newUser);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  // async updateUser(req, res) {
  //   try {
  //     const userId = req.params.id;
  //     const userData = req.body;
  //     const updatedUser = await userService.updateUser(userId, userData);
  //     res.json(updatedUser);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  // async deleteUser(req, res) {
  //   try {
  //     const userId = req.params.id;
  //     await userService.deleteUser(userId);
  //     res.status(204).send();
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }
}

const userController = new UserController();

router.post("/userlogin/", userController.userlogin.bind(userController));
router.post("/userSignup/", upload.single("paymentScreenshot"), userController.userSignup.bind(userController));
router.post("/sendVerificationOTP/", userController.sendVerificationOTP.bind(userController));
router.post("/verifyEmail/", userController.verifyEmail.bind(userController));
router.post("/forgotPasswordSendOTP/", userController.forgotPasswordSendOTP.bind(userController));
router.post("/forgotPasswordSetPassword/", userController.forgotPasswordSetPassword.bind(userController));
router.post("/userWithdDrawAmount/", verifyToken, userController.userWithdDrawAmount.bind(userController));
router.get("/getMyNetworkConnectionBaseLevel/", verifyToken, userController.getMyNetworkConnectionBaseLevel.bind(userController));
router.get("/getUserById/:id", verifyToken, userController.getUserById.bind(userController));

router.get("/getUserBalance/:id", verifyToken, userController.getUserBalance.bind(userController));
router.get("/getMyTranscationRecords/:id", verifyToken, userController.getMyTranscationRecords.bind(userController));

// router.post("/createUser", userController.createUser.bind(userController));
// router.get(
//   "/getAllUsers",
//   verifyToken,
//   userController.getAllUsers.bind(userController)
// );
// router.put(
//   "/updateUser/:id",
//   verifyToken,
//   userController.updateUser.bind(userController)
// );
// router.delete(
//   "/deleteUser/:id",
//   verifyToken,
//   userController.deleteUser.bind(userController)
// );

module.exports = router;
