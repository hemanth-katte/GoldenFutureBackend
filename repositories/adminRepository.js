require("dotenv").config();
const bcrypt = require("bcrypt");

class AdminRepository {
  async getAdminByPhone(phone, password) {
    if (bcrypt.compareSync(password, process.env.ADMIN_PASSWORD) && phone == process.env.ADMIN_PHONENUMBER) {
      return true;
    }
    return false;
  }
}

module.exports = AdminRepository;
