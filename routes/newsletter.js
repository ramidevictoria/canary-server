const express = require('express');
const NewsletterController = require('../controllers/newsletter');

const api = express.Router();

api.post('/add-newsletter', NewsletterController.addNewsletter);

module.exports = api;