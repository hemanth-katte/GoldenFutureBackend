const Account = require("../models/Account");
const User = require("../models/User");
class AccountRepository {
  async getAllAccounts() {
    return await Account.findAll();
  }

  async createAccount(accountData) {
    return await Account.create(accountData);
  }

  async getAccountById(accountId) {
    return await Account.findByPk(accountId);
  }

  async updateAccount(accountId, accountData) {
    const account = await Account.findByPk(accountId);
    if (!account) {
      throw new Error("Account not found");
    }
    return account.update(accountData);
  }

  async deleteAccount(accountId) {
    const account = await Account.findByPk(accountId);
    if (!account) {
      throw new Error("Account not found");
    }
    return await account.destroy();
  }

  async getMyTranscationRecords(userId, transferType) {
    try {
      const transcation = await Account.findAll({
        attributes: ["createdAt", "transferType", "amount", "balance", "accountStatus"],
        where: {
          userId: userId,
        },
      });
      return transcation;
    } catch (error) {
      throw error;
    }
  }

  async userWithdDrawAmount(accountData) {
    try {
      return await Account.create(accountData);
    } catch (error) {
      throw error;
    }
  }

  async getAllPaymentsByStatus(status) {
    try {
      const latestAccounts = await Account.findAll({
        where: {
          accountStatus: status,
        },
        order: [["createdAt", "DESC"]],
      });

      return latestAccounts;
    } catch (error) {
      throw error;
    }
  }

  async updatePaymentsStatusByID(userId, id, status) {
    try {
      const account = await Account.findByPk(id);
      const user = await User.findByPk(userId);
      if (!account) {
        throw new Error("Account not found");
      }
      if (status == "ACCEPTED") {
        account.accountStatus = status;
        user.totalBalance = user.totalBalance - account.amount;
        account.balance = user.totalBalance;
        const pendingAccounts = await Account.findAll({
          where: {
            userId: userId,
            accountStatus: "PENDING",
          },
        });
        if (pendingAccounts.length !== 0) {
          for (const account of pendingAccounts) {
            account.balance = user.totalBalance;
          }
        }
        await Promise.all(pendingAccounts.map((account) => account.save()));
        await account.save();
        await user.save();
      } else {
        account.accountStatus = status;
        await account.save();
        await user.save();
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AccountRepository;
