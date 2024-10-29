const express = require('express');
const AccountService = require('../services/accountService');
const router = express.Router();
const accountService = new AccountService();

class AccountController {

  async getAllAccounts(req, res) {
    try {
      const accounts = await accountService.getAllAccounts();
      res.json(accounts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createAccount(req, res) {
    try {
      const accountData = req.body;
      const newAccount = await accountService.createAccount(accountData);
      res.status(201).json(newAccount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAccountById(req, res) {
    try {
      const accountId = req.params.id;
      const account = await accountService.getAccountById(accountId);
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateAccount(req, res) {
    try {
      const accountId = req.params.id;
      const accountData = req.body;
      const updatedAccount = await accountService.updateAccount(accountId, accountData);
      res.json(updatedAccount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteAccount(req, res) {
    try {
      const accountId = req.params.id;
      await accountService.deleteAccount(accountId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
}

const accountController = new AccountController();


router.post('/createAccount', accountController.createAccount.bind(accountController));
router.get('/getAllAccounts', accountController.getAllAccounts.bind(accountController)); 
router.get('/getAccountById/:id', accountController.getAccountById.bind(accountController));
router.put('/updateAccount/:id', accountController.updateAccount.bind(accountController));
router.delete('/deleteAccount/:id', accountController.deleteAccount.bind(accountController));

module.exports = router;
