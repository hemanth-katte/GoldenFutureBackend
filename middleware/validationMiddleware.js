const { body } = require('express-validator');

module.exports = {
  validateSignup: [
    body('firstname').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
};
