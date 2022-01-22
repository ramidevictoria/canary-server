const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const { API_VERSION } = require('./config');

//LOAD ROUTINGS
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Configure header http

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
    );
    res.header('Access-Control-Request-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//router basic
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);

module.exports = app;