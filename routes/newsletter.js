const express = require('express');
const NewsletterController = '../controllers/Newsletter';

const api = express.Router();

api.post('/add-newsletter/', NewsletterController.addNewsletter);

module.exports = api;