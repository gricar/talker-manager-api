const express = require('express');
const crypto = require('crypto');

const { validateEmail, validatePassword } = require('../middlewares');

const routes = express.Router();

routes.post('/',
  validateEmail,
  validatePassword,
  (_req, res) => {
    const token = crypto.randomBytes(8).toString('hex');
    res.status(200).json({ token });
  });

module.exports = routes;
