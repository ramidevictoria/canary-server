const {response} = require('express');
const { Model } = require('mongoose');
const Newsletter = require('../models/newsletter');


function addNewsletter(req, res) {
    const { email } = req.body;
    const newnewsletter = new Newsletter();

    newnewsletter.email = email.toLowerCase();

    newnewsletter.save((err, newsletterStored) => {
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