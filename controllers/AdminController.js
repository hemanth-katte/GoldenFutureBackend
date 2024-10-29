const express = require("express");
const AdminService = require("../services/adminService");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();
const adminService = new AdminService();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
const excel = require("exceljs");

class AdminController {
  async adminlogin(req, res) {
    const { phone, password } = req.body;
    const isAdmin = await adminService.getAdminByPhone(phone, password);
    if (isAdmin) {
      const token = jwt.sign({ phone: phone }, jwtSecret, {
        expiresIn: "12h", // Token expires in 12 hour
      });
      res.json({ token: token, message: "Admin login successful", success: true });
    } else {
      res.status(401).json({ message: "Invalid credentials", success: false });
    }
  }

  async getAllUsersByStatus(req, res) {
    try {
      const status = req.params.status;
      const users = await adminService.getAllUsersByStatus(status);
      res.json({ userData: users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateUsersStatusByID(req, res) {
    try {
      const { id, status } = req.body;
      const user = await adminService.updateUsersStatusByID(id, status);
      if (user == null) {
        return res.json({ message: "Please insist user to verify email before admin approval", emailVerified: false });
      }
      if (user.status == "ACCEPTED") return res.json({ userData: user, message: "User approved!" });
      return res.json({ userData: user, message: "User rejected!" });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }

  async getAllPaymentsByStatus(req, res) {
    try {
      const status = req.params.status;
      const payments = await adminService.getAllPaymentsByStatus(status);
      res.json({ userPayments: payments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  //used to approve withdraw requests by users
  async updatePaymentsStatusByID(req, res) {
    try {
      const { userId, id, status } = req.body;
      const payments = await adminService.updatePaymentsStatusByID(userId, id, status);
      res.json({ payment: payments, message: "Payment status updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async downloadUserData(req, res) {
    try {
      const fromDate = req.query.fromDate;
      const toDate = req.query.toDate;
      const data = await adminService.getDataByDate(fromDate, toDate);

      if (!data) {
        return res.status(404).json({ message: "Data not found for the specified date." });
      }

      const workbookBuffer = await adminService.generateExcelData(data);

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");
      res.end(workbookBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while fetching and exporting the data.",
      });
    }
  }
}

const adminController = new AdminController();

router.post("/adminlogin/", adminController.adminlogin.bind(adminController));
router.get("/getAllUsersByStatus/:status", verifyToken, adminController.getAllUsersByStatus.bind(adminController));
router.put("/updateUsersStatusByID/", verifyToken, adminController.updateUsersStatusByID.bind(adminController));
router.get("/getAllPaymentsByStatus/:status", verifyToken, adminController.getAllPaymentsByStatus.bind(adminController));
router.put("/updatePaymentsStatusByID/", verifyToken, adminController.updatePaymentsStatusByID.bind(adminController));
router.get("/downloadUserData", verifyToken, adminController.downloadUserData.bind(adminController));

module.exports = router;
