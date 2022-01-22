const FileType = require('file-type');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const User = require("../models/user");

function signUp(req, res) {
  const user = new User();

    const { email, password, repeatPassword } = req.body;

    // user.name = name;
    // user.last_name = last_name;
    user.email = email.toLowerCase();
    user.role = 'admin';
    user.active = false;

    if (!password || !repeatPassword) {

        res
        .status(404)
        .send({message : "Las contrasenias son obligatorias."});
    } else if (password !== repeatPassword) {
        res
        .status(404)
        .send({message : "Las contrasenias no coinciden."});
    } else {
        bcrypt.hash(password, null, null , (err, hash) => {
            if (err) {

                res
                .status(500)
                .send({message : "Error al encriptar la contrasenia."});
            } else {
                user.password = hash;

                user.save((err, userStored) => {
                    if (err) {
                        res
                        .status(500)
                        .send({message : 'El usuario ya existe'});
                    } else {
                        if (!userStored) {
                            res
                            .status(404)
                            .send({message : "No se ha podido crear el usuario."});
                        } else {
                            res
                            .status(200)
                            .send({user : userStored});
                        }
                    }
                });

            }

        });

    }
};

function signIn(req, res) {
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;

    User.findOne({email}, (err, userStored) => {
        if (err)  {
            res.status(500).send({message: 'Error en el servidor.'});   
        } else {
            if (!userStored) {
                res.status(404).send({message: 'Usuario no encontrado.'});
            } else {
                bcrypt.compare(password, userStored.password, (err, success) => {
                    if (err) {
                        res.status(500).send({message: 'Error del servidor.'});
                    } else if (!success) {
                        res.status(404).send({message: 'La contrasenia es incorrecta'});
                    } else {
                        if (!userStored.active) {
                            res.status(200).send({message: 'El usuario no esta habilitado.'});
                        } else {
                            res.status(200).send({
                                accessToken: jwt.createAccessToken(userStored),
                                refreshToken: jwt.createRefreshToken(userStored)
                            });
                        }
                    }
                });
            }
        }
    });
}

function getUsers(req, res) {
    User.find()
    .then(users => {
        if (!users) {
            res.status(404).send({message: 'No se ha encontrado ningun usuario.'});   
        } else {
            res.status(200).send({users});
        }
    })
    .catch(err => {
        console.log(err);   
    });
}

function getUsersActive(req, res) {
    const query = req.query;

    User.find({active: query.active})
    .then(users => {
        if(!users) {
            res.status(404).send({message: 'No se ha encontrado ningun usuario.'});  
        } else {
            res.status(200).send({users});
        }
    })
    .catch(err => {
        res.status(500).send({message: 'Error en el servidor.'});  
    });
}

function uploadAvatar(req, res) {
    const params = req.params;
    User.findById({_id: params.id}, (err, userData) => {
        if (err) {
            res.status(500).send({message: 'Error del servidor'});
        } else {
            if (!userData) {
                res.status(404).send({message: 'Usuario no encontrado'});
            } else {
                let user = userData;
                if (Object.keys(req.files).length > 0) {
                    let filePath = req.files.avatar.path;
                    let fileSplit = filePath.split('\\'); //    PUEDE SER QUE SEA EL WINDOWS, PERO ESTA BARRA DEBERIA SER LA OTRA..
                    //let fileSplit = filePath.split('/');       <---------
                    let fileName = fileSplit[fileSplit.length -1];
                    FileType.fromFile(filePath)
                        .then( r => {
                            if (r.mime !== 'image/png' && r.mime !== 'image/jpg' && r.mime !== 'image/jpeg') {
                                res.status(400).send({message: 'Extension no permitida, solo se permiten jpg, jpeg y png.'});
                            } else {
                                user.avatar = fileName;
                                User.findByIdAndUpdate({_id: params.id}, user, null, (err, userResult) => {
                                    if (err) {
                                        res.status(500).send({message: 'Error del servidor'});
                                    } else {
                                        if (!userResult) {
                                            res.status(404).send({message: 'Usuario no encontrado'});
                                        } else {
                                            res.status(200).send({avatarName: fileName});
                                        }
                                    }
                                });
                            }
                        })
                        .catch((err) => {
                            res.status(500).send({message: 'Error del servidor..'});
                        });
                }
            }
        }
    });
}

function getAvatar(req, res) {
    const avatarName = req.params.avatarName;
    const filePath = './uploads/avatars/' + avatarName;

    fs.access(filePath, fs.constants.F_OK, err => {
        if (err) {
            console.log(err);
            res.status(404).send({message: 'El avatar que busca no existe'});
        } else {
            res.sendFile(path.resolve(filePath));
        }
    });
}

async function updateUser(req, res) {
    let userData = req.body;
    userData.email =  req.body.email.toLowerCase();

    const params = req.params;

    if (userData.password) {
        await bcrypt.hash(userData.password, null, null, (err, hash) => {
            if (err) {
                res.status(500).send({ message: "Error al encriptar la contraseña." });
            } else {
                userData.password = hash;
            }
        });
    }

    User.findByIdAndUpdate({_id: params.id}, userData, null, (err, userUpdate) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if (!userUpdate) {
                res.status(404).send({message: 'Usuario no encontrado'});
            } else {
                console.log(userUpdate);
                res.status(200).send({message: 'Usuario actualizado correctamente'});
            }
        }
    });
}

function activateUser(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    User.findByIdAndUpdate(id, { active }, (err, userStored) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor.'});
        } else {
            if (!userStored) {
                res.status(404).send({message: 'Usuario no encontrado.'});
            } else {
                if (active === true) {
                    res.status(200).send({message: 'Usuario activado correctamente'});
                } else {
                    res.status(200).send({message: 'Usuario desactivado correctamente'});
                }
            }
        }
    })
}

function deleteUser(req, res) {
    const { id } = req.params;
    
    User.findByIdAndDelete(id, (err, userDeleted) => {
        console.log(err);
        if (err) {
            res.status(500).send({message: "No se pudo eliminar el usuario, error en el servidor"});
        } else {
            if (!userDeleted) {
                res.status(404).send({message: "Usuario no encontrado  ¯\\_(ツ)_/¯"});
            } else {
                res.status(200).send({message: "Usuario eliminado correctamente"});
            }
            
        }
    });
}

function signUpAdmin(req, res) {
    const user = new User();

    const { name, last_name, email, role, password } = req.body;

    user.name = name;
    user.last_name = last_name;
    user.email = email.toLowerCase();
    user.role = role;
    user.active = true;

    if (!password) {
        res
        .status(400)
        .send({message : "Las contrasenia es obligatoria."});
    } else {
        bcrypt.hash(password, null, null , (err, hash) => {
            if (err) {
                res
                .status(500)
                .send({message : "Error al encriptar la contrasenia."});
            } else {
                user.password = hash;

                user.save((err, userStored) => {
                    if (err) {
                        res
                        .status(500)
                        .send({message : 'El usuario ya existe'});
                    } else {
                        if (!userStored) {
                            res
                            .status(404)
                            .send({message : "No se ha podido crear el usuario."});
                        } else {
                            res
                            .status(200)
                            .send({message : "Usuario creado satisfactoriamente."});
                        }
                    }
                });
            }
        });
    }
}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUsersActive,
    uploadAvatar,
    updateUser,
    activateUser,
    deleteUser,
    signUpAdmin,
    getAvatar
};