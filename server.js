const express = require('express');
const mongoose = require('mongoose');
const app = express();

const { port } = require('./config/config');

//db config
const db = require('./config/config').mongoURI;

//connect to mongodb
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('mongodb connected');
    })
    .catch(err => {
        console.log(err);
    });

app.get('/', (req, res) => {
    res.send('Hi nodejs app');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});