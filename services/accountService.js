const AccountRepository = require('../repositories/accountRepository');

class AccountService {
  constructor() {
    this.accountRepository = new AccountRepository();
  }

  async getAllAccounts() {
    return this.accountRepository.getAllAccounts();
  }

  async createAccount(accountData) {
    return this.accountRepository.createAccount(accountData);
  }

  async getAccountById(accountId) {
    return this.accountRepository.getAccountById(accountId);
  }

  async updateAccount(accountId, accountData) {
    return this.accountRepository.updateAccount(accountId, accountData);
  }

  async deleteAccount(accountId) {
    return this.accountRepository.deleteAccount(accountId);
  }
}

module.exports = AccountService;
