const express = require('express');
const CourseController = require('../controllers/course');

const api = express.Router();
const md_auth = require('../middleware/authenticated');

api.post('/add-course', [md_auth.ensureAuth], CourseController.addCourse);
api.delete('/delete-course/:id', [md_auth.ensureAuth], CourseController.deleteCourse);
api.put('update-course/:id', [md_auth.ensureAuth], CourseController.updateCourse);
api.get('get-courses', CourseController.getCourses);

module.exports = api;