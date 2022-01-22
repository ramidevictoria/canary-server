const { response } = require('express');
const { Model } = require('mongoose');
const Menu = require('../models/menu');


function addMenu(req, res) {
    const { title, url, order, active } = req.body;
    const Menu = new Menu();

    Menu.title = title;
    Menu.url = url;
    Menu.order = order;
    Menu.active = active;

    Menu.save((err, menuStored) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor.'});   
        } else {
            if (!menuStored) {
                res.status(404).send({message: 'Hubo un problema al guardar los datos.'});
            } else {
                res.status(200).send({message: 'Menu agregado satisfactoriamente.'});
            }
        }
    });
}

function getMenus(req, res) {
    Menu.find()
        .sort({order: 'asc'})
        .exec((err, menus) => {
               if (err) {
                res.status(500).send({message: 'Error en el servidor.'});  
               } else {

                if (!menus) {
                    res.status(404).send({message: 'No se han encontrado Menus.'});
                } else {
                    res.status(200).send({menus});
                }
               }
        });
}

function updateMenu(req, res) {
    let menuData = req.body;
    const {id} = req.params;

    Menu.findOneAndUpdate(id, menuData, (err, updatedMenu) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor.'});
        }

        if (!updatedMenu) {
            res.status(404).send({message: 'Menu no encontrado.'});
        } else {
            res.status(200).send({message: 'Menu actualizado correctamente.'});
        }
    });
}


function activateMenu(req, res) {
    const {id} = req.params;
    const {active} = req.body;

    Menu.findOneAndUpdate(id, {active}, (err, menuUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor.'});
        }

        if (!menuUpdated) {
            res.status(404).send({message: 'Menu no encontrado.'});
        } else {
            if (active) {
                res.status(200).send({message: 'Menu activado correctamente.'});
            } else {
                res.status(200).send({message: 'Menu desactivado correctamente.'});
            }
        }
    });
}


module.exports = {
    addMenu,
    getMenus,
    updateMenu,
    activateMenu
}