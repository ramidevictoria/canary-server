const {response} = require('express');
const { Model } = require('mongoose');
const Newsletter = require('../models/newsletter.js');


function addNewsletter(req, res) {
    const { email } = req.body;
    const newsletter = new Newsletter();

    newsletter.email = email;

    Newsletter.save((err, newsletterStored) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor.'});
        } else {
            if (!newsletterStored) {
                res.status(409).send({message: 'El email ya se enuentra registrado.'});
            } else {
                res.status(200).send({message: 'Email registrado satisfactoriamente.'});
            }
        }
    });
}

module.exports = {
    addNewsletter
}