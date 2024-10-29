const User = require("../models/User");
const { Op } = require("sequelize");

class UserRepository {
  async getAllUsers() {
    return User.findAll();
  }

  async createUser(userData) {
    try {
      return User.create(userData);
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    return await User.findByPk(userId);
  }

  async getUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async getUserByPhone(phone) {
    return await User.findOne({ where: { phone } });
  }

  async getUserBySponsorId(sponsorId) {
    return User.findOne({ where: { referenceId: sponsorId } });
  }

  async updateUser(userId, userData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return await User.update(userData, {
        where: { id: userId },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user.destroy();
  }

  async getUserBalance(userId) {
    const user = await User.findByPk(userId);
    return user.totalBalance;
  }

  async setUserBalance(userId, balance) {
    const user = await User.findByPk(userId);
    user.totalBalance = balance;
    await user.save();
    return user;
  }

  async setUserNetworkLevelCount(userId, networkLevel) {
    const user = await User.findByPk(userId);
    if (networkLevel == 1) {
      user.firstLevelCount = user.firstLevelCount + 1;
      await user.save();
      return user;
    } else if (networkLevel == 2) {
      user.secondLevelCount = user.secondLevelCount + 1;
      await user.save();
      return user;
    } else {
      user.thirdLevelCount = user.thirdLevelCount + 1;
      await user.save();
      return user;
    }
  }

  async setUserStatus(userId, status) {
    const user = await User.findByPk(userId);
    user.status = status;
    await user.save();
    return user;
  }

  async getAllUsersByStatus(status) {
    return await User.findAll({ where: { status } });
  }

  async setUserSponsorId(userId, referenceId) {
    const user = await User.findByPk(userId);
    user.referenceId = referenceId;
    await user.save();
    return user;
  }

  async setEmailVerified(userId, status) {
    const user = await User.findByPk(userId);
    user.emailVerified = status;
    await user.save();
    return true;
  }

  async verifyUser(userData) {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ phone: userData.phone }, { email: userData.email }],
      },
    });
    if (user) {
      return true;
    }
    return false;
  }

  async updateAndSaveUser(userId, password) {
    try {
      const user = await User.findByPk(userId);
      user.password = password;
      await user.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByDate(fromDate, toDate) {
    try {
      // Construct start and end timestamps for the given date
      const startDate = new Date(`${fromDate}T00:00:00.000Z`);
      const endDate = new Date(`${toDate}T23:59:59.999Z`);

      const result = await User.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        attributes: { exclude: ["password"] },
      });

      return result;
    } catch (error) {
      console.error("Error executing Sequelize query:", error);
      throw error;
    }
  }
  // async findByDate(date) {
  //   const query = `
  //       SELECT * FROM "Users"
  //       WHERE DATE("createdAt") = :date
  //     `;

  //   try {
  //     const result = await sequelize.query(query, {
  //       replacements: { date },
  //       type: sequelize.QueryTypes.SELECT,
  //     });
  //     return result;
  //   } catch (error) {
  //     console.error("Error executing SQL query:", error);
  //     throw error;
  //   }
  // }
}
// return await User.findAll({
//   where: { createdAt: date },
//   attributes: { exclude: ["password"] },
// });

module.exports = UserRepository;
