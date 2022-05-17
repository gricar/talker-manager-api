const express = require('express');

const { validateEmail, validatePassword } = require('../middlewares');
const generateToken = require('../utils/generateToken');

const routes = express.Router();

routes.post('/',
  validateEmail,
  validatePassword,
  (_req, res) => res.status(200).json({ token: generateToken() }));

module.exports = routes;
