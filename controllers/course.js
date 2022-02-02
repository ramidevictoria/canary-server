const { response } = require('express');
const { Model } = require('mongoose');

const  Course  = require('../models/course');

function addCourse(req, res) {
    const { course } = req.body;
    const newCourse = new Course(course);

    newCourse.order = 1000;

    newCourse.save((err, courseSaved) => {
        console.log(err)
        if (err) {
            res.status(500).send({message: 'Error en el servidor.'});   
        } else {
            if (!courseSaved) {
                res.status(409).send({message: 'Curso ya registrado.'});
            } else {
                res.status(200).send({message: 'Curso registrado satisfactoriamente.'});
            }
        }
    });
}

function updateCourse(req, res) {
    const { id } = req.params;
    const  course = req.body;

    Course.findOneAndUpdate(id, course, (err, courseUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor.'});
        } else {
            if (!courseUpdated) {
                res.status(404).send({message: 'Curso no encontrado.'});
            } else {
                res.status(200).send({message: 'Curso actualizado correctamente.'});
            }
        }
    });
}

function deleteCourse(req, res) {
    const { id } = req.params;

    Course.findByIdAndRemove(id, (err, courseDeleted) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor.'});
        } else {
            if (!courseDeleted) {
                res.status(404).send({message: 'Curso no encontrado.'});
            } else {
                res.status(200).send({message: 'Curso eliminado correctamente.'});
            }
        }
    });
};

function getCourses(req, res) {
    Course.find({}, (err, courses) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor.'});   
        } else {
            if (!courses) {
                res.status(404).send({courses: courses});
            } else {
                res.status(200).send({courses: courses});
            }
            
        }
    });
}


module.exports = {
    addCourse,
    updateCourse,
    deleteCourse,
    getCourses
};